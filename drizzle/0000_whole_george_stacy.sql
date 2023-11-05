CREATE TABLE `posts` (
	`id` integer PRIMARY KEY NOT NULL,
	`created_at` integer DEFAULT CURRENT_TIMESTAMP,
	`updated_at` integer DEFAULT CURRENT_TIMESTAMP,
	`has_body` integer,
	`body` text,
	`has_image` integer,
	`image` text,
	`authorId` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` integer PRIMARY KEY NOT NULL,
	`full_name` text,
	`user_name` text NOT NULL,
	`email` text NOT NULL,
	`password` text NOT NULL
);
