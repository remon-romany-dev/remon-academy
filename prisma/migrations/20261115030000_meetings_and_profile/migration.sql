-- AlterTable
ALTER TABLE `User` ADD COLUMN `phone` VARCHAR(20) NULL;

-- AlterTable
ALTER TABLE `Enrollment` ADD COLUMN `mode` ENUM('online', 'hall') NOT NULL DEFAULT 'online';

-- CreateTable
CREATE TABLE `ClassMeeting` (
    `id` VARCHAR(191) NOT NULL,
    `courseId` VARCHAR(191) NOT NULL,
    `title` VARCHAR(180) NOT NULL,
    `startsAt` DATETIME(3) NOT NULL,
    `kind` ENUM('online', 'hall') NOT NULL,
    `meetUrl` VARCHAR(300) NULL,
    `place` VARCHAR(180) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `ClassMeeting_courseId_startsAt_idx`(`courseId`, `startsAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Attendance` (
    `id` VARCHAR(191) NOT NULL,
    `meetingId` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `present` BOOLEAN NOT NULL DEFAULT false,
    `markedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Attendance_meetingId_userId_key`(`meetingId`, `userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `ClassMeeting` ADD CONSTRAINT `ClassMeeting_courseId_fkey` FOREIGN KEY (`courseId`) REFERENCES `Course`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Attendance` ADD CONSTRAINT `Attendance_meetingId_fkey` FOREIGN KEY (`meetingId`) REFERENCES `ClassMeeting`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Attendance` ADD CONSTRAINT `Attendance_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
