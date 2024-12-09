-- CreateTable
CREATE TABLE "users" (
    "id" BIGSERIAL NOT NULL,
    "username" VARCHAR(255) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "password_hash" VARCHAR(255) NOT NULL,
    "full_name" VARCHAR(255),
    "work_history" TEXT,
    "skills" TEXT,
    "profile_photo_path" VARCHAR(255) NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "feed" (
    "id" BIGSERIAL NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "content" TEXT NOT NULL,
    "user_id" BIGINT NOT NULL,

    CONSTRAINT "feed_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "chat" (
    "id" BIGSERIAL NOT NULL,
    "timestamp" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "from_id" BIGINT NOT NULL,
    "to_id" BIGINT NOT NULL,
    "message" TEXT NOT NULL,
    "room_id" BIGINT NOT NULL,

    CONSTRAINT "chat_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RoomChat" (
    "id" BIGSERIAL NOT NULL,
    "first_user_id" BIGINT NOT NULL,
    "second_user_id" BIGINT NOT NULL,
    "last_message" TEXT,
    "last_sender_id" BIGINT,
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RoomChat_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "connection_request" (
    "from_id" BIGINT NOT NULL,
    "to_id" BIGINT NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "connection_request_pkey" PRIMARY KEY ("from_id","to_id")
);

-- CreateTable
CREATE TABLE "connection" (
    "from_id" BIGINT NOT NULL,
    "to_id" BIGINT NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "connection_pkey" PRIMARY KEY ("from_id","to_id")
);

-- CreateTable
CREATE TABLE "push_subscriptions" (
    "endpoint" TEXT NOT NULL,
    "user_id" BIGINT,
    "keys" JSONB NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "push_subscriptions_pkey" PRIMARY KEY ("endpoint")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "feed_created_at_idx" ON "feed"("created_at");

-- CreateIndex
CREATE INDEX "chat_timestamp_idx" ON "chat"("timestamp");

-- CreateIndex
CREATE UNIQUE INDEX "RoomChat_first_user_id_second_user_id_key" ON "RoomChat"("first_user_id", "second_user_id");

-- AddForeignKey
ALTER TABLE "feed" ADD CONSTRAINT "feed_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chat" ADD CONSTRAINT "chat_from_id_fkey" FOREIGN KEY ("from_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chat" ADD CONSTRAINT "chat_to_id_fkey" FOREIGN KEY ("to_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chat" ADD CONSTRAINT "chat_room_id_fkey" FOREIGN KEY ("room_id") REFERENCES "RoomChat"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RoomChat" ADD CONSTRAINT "RoomChat_first_user_id_fkey" FOREIGN KEY ("first_user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RoomChat" ADD CONSTRAINT "RoomChat_second_user_id_fkey" FOREIGN KEY ("second_user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RoomChat" ADD CONSTRAINT "RoomChat_last_sender_id_fkey" FOREIGN KEY ("last_sender_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "connection_request" ADD CONSTRAINT "connection_request_from_id_fkey" FOREIGN KEY ("from_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "connection_request" ADD CONSTRAINT "connection_request_to_id_fkey" FOREIGN KEY ("to_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "connection" ADD CONSTRAINT "connection_from_id_fkey" FOREIGN KEY ("from_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "connection" ADD CONSTRAINT "connection_to_id_fkey" FOREIGN KEY ("to_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "push_subscriptions" ADD CONSTRAINT "push_subscriptions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
