"use server";

import { connectToDatabase } from "@/lib/mongoose";
import { UserModel } from "@/database/user.model";

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
