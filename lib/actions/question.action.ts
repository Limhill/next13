"use server";

import { connectToDatabase } from "@/lib/mongoose";
import { QuestionModel } from "@/database/question.model";
import { TagModel } from "@/database/tag.model";
import {
  CreateQuestionParams,
  GetQuestionsParams,
} from "@/lib/actions/shared.types";
import { UserModel } from "@/database/user.model";
import { revalidatePath } from "next/cache";
import { FilterQuery } from "mongoose";

export async function getQuestions(params: GetQuestionsParams) {
  try {
    connectToDatabase();

    const { searchQuery, filter, page = 1, pageSize = 10 } = params;

    // Calculcate the number of posts to skip based on the page number and page size
    const skipAmount = (page - 1) * pageSize;

    const query: FilterQuery<typeof QuestionModel> = {};

    if (searchQuery) {
      query.$or = [
        { title: { $regex: new RegExp(searchQuery, "i") } },
        { content: { $regex: new RegExp(searchQuery, "i") } },
      ];
    }

    let sortOptions = {};

    switch (filter) {
      case "newest":
        sortOptions = { createdAt: -1 };
        break;
      case "frequent":
        sortOptions = { views: -1 };
        break;
      case "unanswered":
        query.answers = { $size: 0 };
        break;
      default:
        break;
    }

    const questions = await QuestionModel.find(query)
      .populate({ path: "tags", model: TagModel })
      .populate({ path: "author", model: UserModel })
      .skip(skipAmount)
      .limit(pageSize)
      .sort(sortOptions);

    const totalQuestions = await QuestionModel.countDocuments(query);

    const isNext = totalQuestions > skipAmount + questions.length;

    return { questions, isNext };
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function createQuestion(params: CreateQuestionParams) {
  try {
    connectToDatabase();

    const { title, content, tags, author, path } = params;

    const question = await QuestionModel.create({ title, content, author });

    const tagDocuments = [];

    for (const tag of tags) {
      const existingTag = await TagModel.findOneAndUpdate(
        { name: { $regex: new RegExp(`^${tag}$`, "i") } },
        { $setOnInsert: { name: tag }, $push: { question: question._id } },
        { upsert: true, new: true },
      );

      tagDocuments.push(existingTag._id);
    }

    await QuestionModel.findByIdAndUpdate(question._id, {
      $push: { tags: { $each: tagDocuments } },
    });

    revalidatePath(path);
  } catch (e) {}
}
