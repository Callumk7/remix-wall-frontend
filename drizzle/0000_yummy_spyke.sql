CREATE TABLE `groups` (
	`id` integer PRIMARY KEY NOT NULL,
	`created_at` integer DEFAULT CURRENT_TIMESTAMP,
	`updated_at` integer DEFAULT CURRENT_TIMESTAMP,
	`name` text NOT NULL,
	`description` text
);
--> statement-breakpoint
CREATE TABLE `posts` (
	`id` integer PRIMARY KEY NOT NULL,
	`created_at` integer DEFAULT CURRENT_TIMESTAMP,
	`updated_at` integer DEFAULT CURRENT_TIMESTAMP,
	`has_body` integer,
	`body` text,
	`has_image` integer,
	`image` text,
	`authorId` integer NOT NULL,
	`in_group` integer,
	`group_id` integer,
	`is_private` integer DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE TABLE `user_friends` (
	`user_id` integer NOT NULL,
	`friend_id` integer NOT NULL,
	PRIMARY KEY(`friend_id`, `user_id`)
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` integer PRIMARY KEY NOT NULL,
	`full_name` text,
	`user_name` text NOT NULL,
	`email` text NOT NULL,
	`password` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `users_to_groups` (
	`user_id` integer NOT NULL,
	`group_id` integer NOT NULL,
	PRIMARY KEY(`group_id`, `user_id`),
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`group_id`) REFERENCES `groups`(`id`) ON UPDATE no action ON DELETE no action
);
