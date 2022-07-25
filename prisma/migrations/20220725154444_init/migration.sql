-- CreateTable
CREATE TABLE "score_ranking" (
    "ID" SERIAL NOT NULL,
    "score" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "CREATED_AT" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "UPDATED_AT" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "score_ranking_pkey" PRIMARY KEY ("ID")
);

-- CreateTable
CREATE TABLE "users" (
    "ID" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "salt" VARCHAR(255) NOT NULL,
    "access_token" VARCHAR(255),
    "expired_at" TIMESTAMP(3) NOT NULL,
    "CREATED_AT" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "UPDATED_AT" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("ID")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_name_key" ON "users"("name");
