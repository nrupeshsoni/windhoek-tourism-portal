CREATE TABLE `cnrtp_categories` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`slug` varchar(255) NOT NULL,
	`description` text,
	`icon` varchar(100),
	`displayOrder` int NOT NULL DEFAULT 0,
	`isActive` boolean NOT NULL DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `cnrtp_categories_id` PRIMARY KEY(`id`),
	CONSTRAINT `cnrtp_categories_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `cnrtp_chat_conversations` (
	`id` int AUTO_INCREMENT NOT NULL,
	`sessionId` varchar(255) NOT NULL,
	`userId` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `cnrtp_chat_conversations_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `cnrtp_chat_messages` (
	`id` int AUTO_INCREMENT NOT NULL,
	`conversationId` int NOT NULL,
	`role` enum('user','assistant') NOT NULL,
	`content` text NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `cnrtp_chat_messages_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `cnrtp_listing_media` (
	`id` int AUTO_INCREMENT NOT NULL,
	`listingId` int NOT NULL,
	`mediaId` int NOT NULL,
	`displayOrder` int NOT NULL DEFAULT 0,
	`isPrimary` boolean NOT NULL DEFAULT false,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `cnrtp_listing_media_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `cnrtp_listings` (
	`id` int AUTO_INCREMENT NOT NULL,
	`categoryId` int NOT NULL,
	`name` varchar(255) NOT NULL,
	`slug` varchar(255) NOT NULL,
	`description` text,
	`shortDescription` varchar(500),
	`location` varchar(255),
	`region` varchar(100),
	`contactEmail` varchar(320),
	`contactPhone` varchar(50),
	`website` varchar(500),
	`address` text,
	`latitude` varchar(50),
	`longitude` varchar(50),
	`priceRange` varchar(50),
	`features` text,
	`isActive` boolean NOT NULL DEFAULT true,
	`isFeatured` boolean NOT NULL DEFAULT false,
	`viewCount` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `cnrtp_listings_id` PRIMARY KEY(`id`),
	CONSTRAINT `cnrtp_listings_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `cnrtp_media` (
	`id` int AUTO_INCREMENT NOT NULL,
	`title` varchar(255),
	`description` text,
	`mediaType` enum('photo','video','vr') NOT NULL,
	`fileUrl` varchar(1000) NOT NULL,
	`thumbnailUrl` varchar(1000),
	`fileKey` varchar(500) NOT NULL,
	`mimeType` varchar(100),
	`fileSize` int,
	`width` int,
	`height` int,
	`duration` int,
	`altText` varchar(500),
	`caption` text,
	`uploadedBy` int,
	`isActive` boolean NOT NULL DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `cnrtp_media_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `cnrtp_users` (
	`id` int AUTO_INCREMENT NOT NULL,
	`openId` varchar(64) NOT NULL,
	`name` text,
	`email` varchar(320),
	`loginMethod` varchar(64),
	`role` enum('user','admin') NOT NULL DEFAULT 'user',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`lastSignedIn` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `cnrtp_users_id` PRIMARY KEY(`id`),
	CONSTRAINT `cnrtp_users_openId_unique` UNIQUE(`openId`)
);
--> statement-breakpoint
DROP TABLE `users`;