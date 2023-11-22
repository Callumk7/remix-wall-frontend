import { PageWithPostsAndNotes, Post } from "db/schema";
import { PostBatchByDate } from "../types";
import { createCalendarDate } from "@/util/date-utilities";
import { CalendarDate } from "@internationalized/date";

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

interface PageBatchByDate {
	date: string;
	pages: PageWithPostsAndNotes[];
}

export function organisePagesByDate(
	pages: PageWithPostsAndNotes[],
): PageBatchByDate[] {
	const pagesByDate = pages.reduce((acc: PageBatchByDate[], page) => {
		const date = createCalendarDate(page.entryDate!).toString();

		let pageBatch = acc.find((batch) => batch.date === date);

		if (!pageBatch) {
			pageBatch = {
				date: date,
				pages: [],
			};
			acc.push(pageBatch);
		}

		pageBatch.pages.push(page);

		return acc;
	}, []);

	pagesByDate.sort(
		(a, b) => new Date(a.date).getDate() - new Date(b.date).getDate(),
	);
	return pagesByDate;
}
