CREATE TABLE `cnrtp_favorites` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int,
	`sessionId` varchar(255),
	`listingId` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `cnrtp_favorites_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `cnrtp_trip_days` (
	`id` int AUTO_INCREMENT NOT NULL,
	`tripId` int NOT NULL,
	`dayNumber` int NOT NULL,
	`date` timestamp,
	`title` varchar(255),
	`notes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `cnrtp_trip_days_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `cnrtp_trip_items` (
	`id` int AUTO_INCREMENT NOT NULL,
	`tripDayId` int NOT NULL,
	`listingId` int NOT NULL,
	`displayOrder` int NOT NULL DEFAULT 0,
	`notes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `cnrtp_trip_items_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `cnrtp_trips` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int,
	`sessionId` varchar(255),
	`name` varchar(255) NOT NULL,
	`description` text,
	`startDate` timestamp,
	`endDate` timestamp,
	`coverImage` varchar(1000),
	`isPublic` boolean NOT NULL DEFAULT false,
	`shareCode` varchar(50),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `cnrtp_trips_id` PRIMARY KEY(`id`)
);
