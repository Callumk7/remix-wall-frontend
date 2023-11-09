import { auth } from "@/features/auth/helper";
import { ActionFunctionArgs, json } from "@remix-run/node";
import { db } from "db";
import { posts } from "db/schema";
import { eq } from "drizzle-orm";

export const action = async ({ request, params }: ActionFunctionArgs) => {
	const session = await auth(request);
	const postId = params.postId;

	if (!postId) {
		return json("error");
	}

	switch (request.method) {
		case "PATCH": {
			const patchedPost = handlePATCH(request, postId);

			return json(
				{ patchedPost },
				{ status: 200, statusText: "Successfully created a new post" },
			);
		}

		default: {
			return json("Bad Request", {
				status: 401,
				statusText: `Bad Request, ${request.method} is not supported`,
			});
		}
	}
};

const handlePATCH = async (request: Request, postId: string) => {
	const formData = await request.formData();
	const bodyUpdate = formData.get("bodyUpdate")?.toString();
	const updatedPost = await db
		.update(posts)
		.set({
			body: bodyUpdate,
			updatedAt: new Date(),
			isUpdated: true,
		})
		.where(eq(posts.id, postId));

	return updatedPost;
};
