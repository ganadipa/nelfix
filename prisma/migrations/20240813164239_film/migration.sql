-- CreateTable
CREATE TABLE "Film" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "director" TEXT NOT NULL,
    "releaseYear" INTEGER NOT NULL,
    "genre" TEXT[],
    "price" INTEGER NOT NULL,
    "duration" INTEGER NOT NULL,
    "videoUrl" TEXT NOT NULL,
    "imageUrl" TEXT,

    CONSTRAINT "Film_pkey" PRIMARY KEY ("id")
);
