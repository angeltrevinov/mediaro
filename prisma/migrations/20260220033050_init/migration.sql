-- CreateTable
CREATE TABLE "Movie" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "original_title" TEXT NOT NULL,
    "release_date" DATETIME NOT NULL,
    "poster_path" TEXT NOT NULL,
    "backdrop_path" TEXT NOT NULL,
    "overview" TEXT NOT NULL,
    "runtime" INTEGER NOT NULL,
    "genres" JSONB NOT NULL,
    "metadata" JSONB NOT NULL,
    "last_synced" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "MovieTracking" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "user_id" INTEGER NOT NULL,
    "movie_id" INTEGER NOT NULL,
    "status" TEXT NOT NULL,
    "rating" INTEGER,
    "watched_date" DATETIME,
    "notes" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "MovieTracking_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "MovieTracking_movie_id_fkey" FOREIGN KEY ("movie_id") REFERENCES "Movie" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "MovieTracking_user_id_movie_id_key" ON "MovieTracking"("user_id", "movie_id");
