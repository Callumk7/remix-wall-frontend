CREATE TABLE `posts_saved_by_users` (
	`user_id` text NOT NULL,
	`post_id` text NOT NULL,
	PRIMARY KEY(`post_id`, `user_id`)
);
