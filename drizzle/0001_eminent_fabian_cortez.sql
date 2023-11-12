CREATE TABLE `comments` (
	`id` text PRIMARY KEY NOT NULL,
	`created_at` integer DEFAULT CURRENT_TIMESTAMP,
	`updated_at` integer DEFAULT CURRENT_TIMESTAMP,
	`is_updated` integer DEFAULT false,
	`post_id` text NOT NULL,
	`author_id` text NOT NULL
);
