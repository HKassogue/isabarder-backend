/*
  Warnings:

  - Added the required column `updatedAt` to the `Creneau` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Creneau` ADD COLUMN `updatedAt` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `Modele` ADD COLUMN `isActive` BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE `Rdv` MODIFY `statut` ENUM('DEMANDE', 'CONFIRME', 'ANNULE', 'TERMINE', 'TERMINE_ET_PAYE') NOT NULL DEFAULT 'DEMANDE';

-- AlterTable
ALTER TABLE `Service` ADD COLUMN `isActive` BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE `User` ADD COLUMN `isActive` BOOLEAN NOT NULL DEFAULT true;
