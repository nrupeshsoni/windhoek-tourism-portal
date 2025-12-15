ALTER TABLE `cnrtp_listings` ADD `metadata` text;--> statement-breakpoint
ALTER TABLE `cnrtp_listings` ADD `ntbRegNo` varchar(50);--> statement-breakpoint
ALTER TABLE `cnrtp_listings` ADD `isVerified` boolean DEFAULT false NOT NULL;