import { Post } from "db/schema";

interface PostSeries {
	date: Date;
	posts: Post[];
}

export function reduceToPostSeries(posts: Post[]): PostSeries[] {
	const postSeries = posts.reduce((acc: PostSeries[], post) => {
		// Transform the timestamp to a date string format 'YYYY-MM-DD'
		const date = new Date(post.createdAt!).toISOString().split("T")[0];

		// Find the corresponding date in the accumulated object
		let dateGroup = acc.find(
			(group) => group.date.toISOString().split("T")[0] === date,
		);

		// If no date group has been created yet, create one
		if (!dateGroup) {
			dateGroup = {
				date: new Date(date),
				posts: [],
			};

			// Add the new date group to the accumulated object
			acc.push(dateGroup);
		}

		// Add the current post to the current date group
		dateGroup.posts.push(post);

		return acc;
	}, []);

	return postSeries;
}
