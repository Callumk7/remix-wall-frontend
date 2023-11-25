import { db } from "db";
import { PostWithCommentsWithAuthor, posts } from "db/schema";
import { eq } from "drizzle-orm";

export const getAllPosts = async (
	userId: string,
): Promise<PostWithCommentsWithAuthor[]> => {
	// if (userId.slice(0, 3) !== "user") {
	// 	throw new Error("Invalid user Id, must start with user");
	// }

	try {
		const allPosts = await db.query.posts.findMany({
			where: eq(posts.authorId, userId),
		});
		return allPosts;
	} catch (err) {
		throw new Error("Error fetching posts from database");
	}
};
