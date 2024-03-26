"use server";

import { connectToDatabase } from "@/lib/mongoose";
import { UserModel } from "@/database/user.model";
import {
  CreateUserParams,
  DeleteUserParams,
  UpdateUserParams,
} from "@/lib/actions/shared.types";
import { revalidatePath } from "next/cache";
import { QuestionModel } from "@/database/question.model";

export async function getUserById(params: { userId: string }) {
  try {
    connectToDatabase();

    const { userId } = params;

    const user = await UserModel.findOne({ clerkId: userId });

    return user;
  } catch (e) {
    console.log(e);

    throw e;
  }
}

export async function createUser(userData: CreateUserParams) {
  try {
    connectToDatabase();

    const newUser = await UserModel.create(userData);

    return newUser;
  } catch (e) {
    console.log(e);
    throw e;
  }
}

export async function updateUser(params: UpdateUserParams) {
  try {
    connectToDatabase();

    const { clerkId, updateData, path } = params;

    await UserModel.findOneAndUpdate({ clerkId }, updateData, { new: true });

    revalidatePath(path);
  } catch (e) {
    console.log(e);
    throw e;
  }
}

export async function deleteUser(params: DeleteUserParams) {
  try {
    connectToDatabase();

    const { clerkId } = params;

    const user = await UserModel.findOneAndDelete({ clerkId });

    if (!user) {
      throw new Error("User not found");
    }

    const userQuestionIds = await QuestionModel.find({
      author: user._id,
    }).distinct("_id");

    await QuestionModel.deleteMany({ author: user._id });

    const deletedUser = await UserModel.findOneAndDelete({ clerkId });

    return deletedUser;
  } catch (e) {
    console.log(e);
    throw e;
  }
}
