import { db } from "db";
import { posts } from "db/schema";
import { and, between, eq } from "drizzle-orm";

// TODO: user ids (and all ids) should really be strings, not numbers

// The to and from input for this function are day numbers, not dates.
export const getUserPostsBetweenDates = async (
	from: number,
	to: number,
	userId: number,
) => {
	const userPosts = await db
		.select()
		.from(posts)
		.where(and(eq(posts.authorId, userId), between(posts.day, from, to)));

	return userPosts;
};
