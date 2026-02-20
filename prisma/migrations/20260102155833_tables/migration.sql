-- CreateTable
CREATE TABLE "tb_admin_users" (
    "id" UUID NOT NULL,
    "username" VARCHAR(50) NOT NULL,
    "password_hash" TEXT NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tb_admin_users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tb_news" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "summary" TEXT,
    "body" TEXT NOT NULL,
    "author" TEXT,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "newstype" TEXT,
    "curtidas" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "tb_news_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tb_users" (
    "id" UUID NOT NULL,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "senha_hash" TEXT NOT NULL,

    CONSTRAINT "tb_users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tb_files" (
    "id" TEXT NOT NULL,
    "image1" TEXT,
    "image2" TEXT,
    "image3" TEXT,
    "image4" TEXT,
    "image5" TEXT,
    "noticiaId" TEXT NOT NULL,

    CONSTRAINT "tb_files_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "tb_admin_users_username_key" ON "tb_admin_users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "tb_users_email_key" ON "tb_users"("email");

-- AddForeignKey
ALTER TABLE "tb_files" ADD CONSTRAINT "tb_files_noticiaId_fkey" FOREIGN KEY ("noticiaId") REFERENCES "tb_news"("id") ON DELETE CASCADE ON UPDATE CASCADE;
