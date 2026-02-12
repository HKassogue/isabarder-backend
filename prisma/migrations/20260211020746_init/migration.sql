-- CreateTable
CREATE TABLE `User` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `username` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `passwordHash` VARCHAR(191) NOT NULL,
    `photoUrl` VARCHAR(191) NULL,
    `role` ENUM('CLIENT', 'COIFFEUR', 'GERANT') NOT NULL DEFAULT 'CLIENT',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `User_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Service` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nom` VARCHAR(191) NOT NULL,
    `photoUrl` VARCHAR(191) NULL,
    `details` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Modele` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nom` VARCHAR(191) NOT NULL,
    `photoUrl` VARCHAR(191) NULL,
    `details` VARCHAR(191) NULL,
    `prix` INTEGER NOT NULL,
    `dureeMin` INTEGER NOT NULL,
    `serviceId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `Modele_serviceId_idx`(`serviceId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Creneau` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `startAt` DATETIME(3) NOT NULL,
    `endAt` DATETIME(3) NOT NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `coiffeurId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `Creneau_coiffeurId_idx`(`coiffeurId`),
    INDEX `Creneau_startAt_idx`(`startAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Rdv` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `statut` ENUM('DEMANDE', 'CONFIRME', 'ANNULE', 'TERMINE') NOT NULL DEFAULT 'DEMANDE',
    `date` DATETIME(3) NOT NULL,
    `clientId` INTEGER NOT NULL,
    `coiffeurId` INTEGER NOT NULL,
    `modeleId` INTEGER NOT NULL,
    `creneauId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `Rdv_clientId_idx`(`clientId`),
    INDEX `Rdv_coiffeurId_idx`(`coiffeurId`),
    INDEX `Rdv_modeleId_idx`(`modeleId`),
    UNIQUE INDEX `Rdv_creneauId_key`(`creneauId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Avis` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `note` INTEGER NOT NULL,
    `commentaire` VARCHAR(191) NULL,
    `date` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `rdvId` INTEGER NOT NULL,

    UNIQUE INDEX `Avis_rdvId_key`(`rdvId`),
    INDEX `Avis_note_idx`(`note`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Modele` ADD CONSTRAINT `Modele_serviceId_fkey` FOREIGN KEY (`serviceId`) REFERENCES `Service`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Creneau` ADD CONSTRAINT `Creneau_coiffeurId_fkey` FOREIGN KEY (`coiffeurId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Rdv` ADD CONSTRAINT `Rdv_clientId_fkey` FOREIGN KEY (`clientId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Rdv` ADD CONSTRAINT `Rdv_coiffeurId_fkey` FOREIGN KEY (`coiffeurId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Rdv` ADD CONSTRAINT `Rdv_modeleId_fkey` FOREIGN KEY (`modeleId`) REFERENCES `Modele`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Rdv` ADD CONSTRAINT `Rdv_creneauId_fkey` FOREIGN KEY (`creneauId`) REFERENCES `Creneau`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Avis` ADD CONSTRAINT `Avis_rdvId_fkey` FOREIGN KEY (`rdvId`) REFERENCES `Rdv`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
