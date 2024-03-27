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

export async function getQuestions(params: GetQuestionsParams) {
  try {
    await connectToDatabase();
    const questions = await QuestionModel.find({})
      .populate({
        path: "tags",
        model: TagModel,
      })
      .populate({ path: "author", model: UserModel })
      .sort({ createdAt: -1 });

    return { questions };
  } catch (e) {
    console.log(e);
    throw e;
  }
}

export async function createQuestion(params: CreateQuestionParams) {
  try {
    await connectToDatabase();

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
