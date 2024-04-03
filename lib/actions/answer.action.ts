"use server";

import { CreateAnswerParams } from "@/lib/actions/shared.types";
import { connectToDatabase } from "@/lib/mongoose";
import { AnswerModel } from "@/database/answer.model";
import { Question } from "@/database/question.model";
import { revalidatePath } from "next/cache";

export async function createAnswer(params: CreateAnswerParams) {
  try {
    connectToDatabase();

    const { content, author, question, path } = params;

    const newAnswer = new AnswerModel({ content, author, question });

    // Add the answer to the question's answers array
    await Question.findByIdAndUpdate(question, {
      $push: { answers: newAnswer._id },
    });

    // TODO: Add interaction...

    revalidatePath(path);
  } catch (e) {
    console.log(e);
    throw e;
  }
}
