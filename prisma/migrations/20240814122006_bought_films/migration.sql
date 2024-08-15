-- AlterTable
ALTER TABLE "User" ALTER COLUMN "role" SET DEFAULT 'USER';

-- CreateTable
CREATE TABLE "BoughtFilm" (
    "id" TEXT NOT NULL,
    "purchasedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,
    "filmId" TEXT NOT NULL,

    CONSTRAINT "BoughtFilm_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "BoughtFilm" ADD CONSTRAINT "BoughtFilm_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BoughtFilm" ADD CONSTRAINT "BoughtFilm_filmId_fkey" FOREIGN KEY ("filmId") REFERENCES "Film"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
