ALTER TABLE `blog_posts` ADD `image` text;--> statement-breakpoint
ALTER TABLE `faculty` ADD `image` text;--> statement-breakpoint
ALTER TABLE `testimonials` ADD `youtube_url` text;--> statement-breakpoint
ALTER TABLE `testimonials` ADD `image` text;--> statement-breakpoint
ALTER TABLE `faculty` DROP COLUMN `initials`;--> statement-breakpoint
ALTER TABLE `testimonials` DROP COLUMN `initials`;