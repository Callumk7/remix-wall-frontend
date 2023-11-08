import { Post } from "db/schema";

export interface PostBatchByDate {
	date: Date;
	posts: Post[];
}
