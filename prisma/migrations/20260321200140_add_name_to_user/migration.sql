/*
  Warnings:

  - You are about to drop the column `metadata` on the `Movie` table. All the data in the column will be lost.
  - You are about to drop the column `email` on the `User` table. All the data in the column will be lost.
  - Added the required column `name` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Movie" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "original_title" TEXT NOT NULL,
    "release_date" DATETIME NOT NULL,
    "poster_path" TEXT NOT NULL,
    "backdrop_path" TEXT NOT NULL,
    "overview" TEXT NOT NULL,
    "runtime" INTEGER NOT NULL,
    "genres" JSONB NOT NULL,
    "last_synced" DATETIME NOT NULL
);
INSERT INTO "new_Movie" ("backdrop_path", "genres", "id", "last_synced", "original_title", "overview", "poster_path", "release_date", "runtime", "title") SELECT "backdrop_path", "genres", "id", "last_synced", "original_title", "overview", "poster_path", "release_date", "runtime", "title" FROM "Movie";
DROP TABLE "Movie";
ALTER TABLE "new_Movie" RENAME TO "Movie";
CREATE UNIQUE INDEX "Movie_id_key" ON "Movie"("id");
CREATE TABLE "new_User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "username" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'user',
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL
);
INSERT INTO "new_User" ("created_at", "id", "password_hash", "role", "updated_at", "username") SELECT "created_at", "id", "password_hash", "role", "updated_at", "username" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
