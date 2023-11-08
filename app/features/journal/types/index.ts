import { Post } from "db/schema";

export interface PostSeries {
	date: Date;
	posts: Post[];
}
