"use server";

import { GetTopInteractedTagsParams } from "@/lib/actions/shared.types";
import { connectToDatabase } from "@/lib/mongoose";
import { User } from "@/database/user.model";

export async function getTopInteractedTags(params: GetTopInteractedTagsParams) {
  try {
    connectToDatabase();

    const { userId } = params;

    const user = await User.findById(userId);

    if (!user) throw new Error("User not found");

    // Find interactions for the user and group by tags...
    // Interaction...

    return [
      { _id: "1", name: "Tag1" },
      { _id: "2", name: "Tag2" },
      { _id: "3", name: "Tag3" },
    ];
  } catch (e) {
    console.log(e);
    throw e;
  }
}
