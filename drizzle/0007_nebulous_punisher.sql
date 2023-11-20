CREATE TABLE `pages` (
	`id` text PRIMARY KEY NOT NULL,
	`owner_id` text NOT NULL,
	`created_at` integer DEFAULT CURRENT_TIMESTAMP,
	`updated_at` integer DEFAULT CURRENT_TIMESTAMP,
	`is_updated` integer DEFAULT false,
	`day` integer NOT NULL,
	`month` integer NOT NULL,
	`year` integer NOT NULL,
	`entry_date` integer DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
ALTER TABLE notes ADD `page_id` text;--> statement-breakpoint
ALTER TABLE posts ADD `page_id` text;