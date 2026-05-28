CREATE TABLE `bookings` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`phone` varchar(30) NOT NULL,
	`tripDate` varchar(50),
	`notes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `bookings_id` PRIMARY KEY(`id`)
);
