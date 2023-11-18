import { auth } from "@/features/auth/helper";
import { ActionFunctionArgs, json } from "@remix-run/node";
import { db } from "db";
import { postsSavedByUsers } from "db/schema";
import invariant from "tiny-invariant";

export const action = async ({ request, params }: ActionFunctionArgs) => {
	const session = await auth(request);
	// action

	const postId = params.postId;
	invariant(postId, "Must have postId present");

	const savedPost = await db.insert(postsSavedByUsers).values({
		userId: session.id,
		postId: postId,
	}).returning();

	console.log(savedPost)

	return json({ savedPost });
};
