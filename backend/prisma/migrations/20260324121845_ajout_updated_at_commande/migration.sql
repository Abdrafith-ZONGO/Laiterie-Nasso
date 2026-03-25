/*
  Warnings:

  - Added the required column `updatedAt` to the `Commande` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Commande" ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "statut" SET DEFAULT 'EN_ATTENTE';
