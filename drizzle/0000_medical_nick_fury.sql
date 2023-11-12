CREATE TABLE `comments` (
	`id` text PRIMARY KEY NOT NULL,
	`created_at` integer DEFAULT CURRENT_TIMESTAMP,
	`updated_at` integer DEFAULT CURRENT_TIMESTAMP,
	`is_updated` integer DEFAULT false,
	`post_id` text NOT NULL,
	`author_id` text NOT NULL,
	`body` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `groups` (
	`id` text PRIMARY KEY NOT NULL,
	`created_at` integer DEFAULT CURRENT_TIMESTAMP,
	`updated_at` integer DEFAULT CURRENT_TIMESTAMP,
	`name` text NOT NULL,
	`description` text
);
--> statement-breakpoint
CREATE TABLE `posts` (
	`id` text PRIMARY KEY NOT NULL,
	`created_at` integer DEFAULT CURRENT_TIMESTAMP,
	`updated_at` integer DEFAULT CURRENT_TIMESTAMP,
	`is_updated` integer DEFAULT false,
	`day` integer NOT NULL,
	`month` integer NOT NULL,
	`year` integer NOT NULL,
	`entry_date` integer DEFAULT CURRENT_TIMESTAMP,
	`body` text NOT NULL,
	`author_id` text NOT NULL,
	`in_group` integer DEFAULT false NOT NULL,
	`group_id` text,
	`on_wall` integer DEFAULT false NOT NULL,
	`wall_user_id` text,
	`is_private` integer DEFAULT false NOT NULL,
	FOREIGN KEY (`author_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `profiles` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text,
	`first_name` text NOT NULL,
	`last_name` text NOT NULL,
	`user_name` text NOT NULL,
	`profile_picture_url` text,
	`bio` text,
	`date_of_birth` integer DEFAULT 0
);
--> statement-breakpoint
CREATE TABLE `user_friends` (
	`user_id` text NOT NULL,
	`friend_id` text NOT NULL,
	PRIMARY KEY(`friend_id`, `user_id`)
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` text PRIMARY KEY NOT NULL,
	`email` text NOT NULL,
	`password` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `users_to_groups` (
	`user_id` text NOT NULL,
	`group_id` text NOT NULL,
	PRIMARY KEY(`group_id`, `user_id`),
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`group_id`) REFERENCES `groups`(`id`) ON UPDATE no action ON DELETE no action
);
