-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "NodeType" ADD VALUE 'TRIGGER';
ALTER TYPE "NodeType" ADD VALUE 'ACTION';
ALTER TYPE "NodeType" ADD VALUE 'CONDITION';
ALTER TYPE "NodeType" ADD VALUE 'WEBHOOK';
ALTER TYPE "NodeType" ADD VALUE 'LOOP';
ALTER TYPE "NodeType" ADD VALUE 'MERGE';

-- AlterTable
ALTER TABLE "connection" ALTER COLUMN "fromOutput" SET DEFAULT 'main',
ALTER COLUMN "toInput" SET DEFAULT 'main';

-- AlterTable
ALTER TABLE "node" ADD COLUMN     "icon" TEXT,
ADD COLUMN     "label" TEXT,
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'idle';
