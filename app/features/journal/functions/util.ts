import { Post } from "db/schema";
import { PostSeries } from "../types";


// This function collects all posts into a series organised by date. I have added a second 
// Level of functionality, which simply ensures that the series is sorted by date
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

	postSeries.sort((a, b) => a.date.getDate() - b.date.getDate())

	return postSeries;
}
