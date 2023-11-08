import { Post } from "db/schema";
import { PostBatchByDate } from "../types";

export function reduceToPostBatchArray(posts: Post[]): PostBatchByDate[] {
	const postBatchArray = posts.reduce((acc: PostBatchByDate[], post) => {
		const date = new Date(post.entryDate!).toISOString().split("T")[0];

		let postBatch = acc.find(
			(batch) => batch.date.toISOString().split("T")[0] === date,
		);

		if (!postBatch) {
			postBatch = {
				date: new Date(date),
				posts: [],
			};
			acc.push(postBatch);
		}

		postBatch.posts.push(post);

		return acc;
	}, []);

	postBatchArray.sort((a, b) => a.date.getDate() - b.date.getDate());
	return postBatchArray;
}
