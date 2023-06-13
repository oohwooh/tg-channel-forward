-- CreateTable
CREATE TABLE "Post" (
    "post_channel_id" TEXT NOT NULL,
    "post_chat_id" TEXT NOT NULL,
    "channelId" TEXT NOT NULL,
    "chatId" TEXT NOT NULL,

    CONSTRAINT "Post_pkey" PRIMARY KEY ("post_channel_id","post_chat_id")
);

-- CreateTable
CREATE TABLE "Channel" (
    "id" TEXT NOT NULL,

    CONSTRAINT "Channel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Chat" (
    "id" TEXT NOT NULL,

    CONSTRAINT "Chat_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_ChannelToChat" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_ChannelToChat_AB_unique" ON "_ChannelToChat"("A", "B");

-- CreateIndex
CREATE INDEX "_ChannelToChat_B_index" ON "_ChannelToChat"("B");

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_channelId_fkey" FOREIGN KEY ("channelId") REFERENCES "Channel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_chatId_fkey" FOREIGN KEY ("chatId") REFERENCES "Chat"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ChannelToChat" ADD CONSTRAINT "_ChannelToChat_A_fkey" FOREIGN KEY ("A") REFERENCES "Channel"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ChannelToChat" ADD CONSTRAINT "_ChannelToChat_B_fkey" FOREIGN KEY ("B") REFERENCES "Chat"("id") ON DELETE CASCADE ON UPDATE CASCADE;
