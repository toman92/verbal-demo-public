-- CreateTable
CREATE TABLE `User` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `email` VARCHAR(100) NOT NULL,
    `password` VARCHAR(255) NULL,
    `visitCount` INTEGER NOT NULL DEFAULT 0,
    `firstName` VARCHAR(100) NULL,
    `lastName` VARCHAR(100) NULL,
    `roleId` INTEGER NOT NULL,
    `deleted` BOOLEAN NOT NULL DEFAULT false,

    UNIQUE INDEX `User_email_key`(`email`),
    INDEX `email`(`email`),
    INDEX `roleId`(`roleId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Role` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` ENUM('Admin', 'StoryAdmin', 'Coordinator') NOT NULL,

    UNIQUE INDEX `Role_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `RolePermission` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `roleId` INTEGER NOT NULL,
    `permission` ENUM('FullAccess', 'WidgetView', 'StoryView', 'StoryCreate', 'StoryUpdate', 'StoryDelete', 'UserView', 'UserCreate', 'UserUpdate', 'UserDelete') NOT NULL,

    INDEX `roleId`(`roleId`),
    UNIQUE INDEX `RolePermission_roleId_permission_key`(`roleId`, `permission`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Story` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `createdById` INTEGER NULL,
    `synopsis` LONGTEXT NOT NULL DEFAULT '',
    `overview` LONGTEXT NULL,
    `storyName` VARCHAR(150) NOT NULL,
    `author` VARCHAR(100) NOT NULL DEFAULT '',
    `type` ENUM('ShortStory', 'Extract') NOT NULL DEFAULT 'ShortStory',
    `createdDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `Story_id_key`(`id`),
    UNIQUE INDEX `Story_storyName_key`(`storyName`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `User` ADD CONSTRAINT `User_roleId_fkey` FOREIGN KEY (`roleId`) REFERENCES `Role`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RolePermission` ADD CONSTRAINT `RolePermission_roleId_fkey` FOREIGN KEY (`roleId`) REFERENCES `Role`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Story` ADD CONSTRAINT `Story_createdById_fkey` FOREIGN KEY (`createdById`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
