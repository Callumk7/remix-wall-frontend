CREATE TABLE `sub_notes` (
	`parent_id` text NOT NULL,
	`child_id` text NOT NULL,
	PRIMARY KEY(`child_id`, `parent_id`)
);
--> statement-breakpoint
ALTER TABLE notes ADD `parent_type` text;--> statement-breakpoint
ALTER TABLE notes ADD `parent_note_id` text;--> statement-breakpoint
ALTER TABLE notes ADD `post_id` text;--> statement-breakpoint
ALTER TABLE `notes` DROP COLUMN `in_group`;--> statement-breakpoint
ALTER TABLE `notes` DROP COLUMN `on_wall`;--> statement-breakpoint
ALTER TABLE `notes` DROP COLUMN `recipient_user_id`;--> statement-breakpoint
ALTER TABLE `notes` DROP COLUMN `is_journal_entry`;