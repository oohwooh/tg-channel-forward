import { Telegraf, Context } from "telegraf";
import { Channel, PrismaClient } from '@prisma/client';
import dotenv from "dotenv"
import { Update } from "telegraf/typings/core/types/typegram";

dotenv.config()

const bot = new Telegraf(process.env.TG_BOT_TOKEN || '')
const prisma = new PrismaClient()

  
bot.on('my_chat_member', async (ctx: Context) => { // triggers whenever bot is added to a group or channel
  const update = (ctx.update as Update.MyChatMemberUpdate).my_chat_member
  if(update.chat.type === "private") return 
  console.log(`now ${update.new_chat_member.status} in ${update.chat.title}`)
  if(update.new_chat_member.status === 'left' || update.new_chat_member.status === 'kicked') return;
  switch (update.chat.type) {
    case 'channel': {
      try {
        await prisma.channel.create({
          data: {
            id: update.chat.id.toString(),
            added_by_user_id: update.from.id.toString(),
          }
        })
      } catch {

      }
      const chats = await prisma.chat.findMany({
        where: {
          added_by_user_id: update.from.id.toString()
        }
      })
      if(chats) {
        if(chats.length === 1) {
          await prisma.channel.update({
            where: {
              id: update.chat.id.toString()
            },
            data: {
              forwards_to: {
                connect: {
                  id: chats[0].id
                }
              }
            }
          })
        }
      }
      break;
    }
    case 'group':
    case 'supergroup': {
      try {
        await prisma.chat.create({
          data: {
            id: update.chat.id.toString(),
            added_by_user_id: update.from.id.toString(),
          }
        })
      } catch {

      }
      break;
    }
    default: {
      return
    }
  }

})

bot.on('channel_post', async (ctx) => {
  const channel_id = ctx.update.channel_post.chat.id
  const source_id = ctx.update.channel_post.message_id
  const destinationChats = await prisma.channel.findUnique({
    where: {
      id: channel_id.toString()
    }
  }).forwards_to() || []
  destinationChats.forEach(async (chat) => {
    const msg = await bot.telegram.forwardMessage(chat.id, channel_id, source_id)
    // await bot.telegram.pinChatMessage(chat.id, msg.message_id, { disable_notification: true })
    await prisma.post.create({
      data: {
        channelId: channel_id.toString(),
        chatId: chat.id,
        post_channel_id: source_id.toString(),
        post_chat_id: msg.message_id.toString()
      }
    })
  })
})

bot.on('edited_channel_post', async (ctx) => {
  const channel_id = ctx.update.edited_channel_post.chat.id
  const source_id = ctx.update.edited_channel_post.message_id
  const posts = await prisma.post.findMany({
    where: {
      channelId: channel_id.toString(),
      post_channel_id: source_id.toString(),
    }
  })
  posts.forEach(async (post) => {
    await bot.telegram.deleteMessage(post.chatId, parseInt(post.post_chat_id))
    const msg = await bot.telegram.forwardMessage(post.chatId, channel_id, source_id)
    // await bot.telegram.pinChatMessage(post.chatId, msg.message_id, { disable_notification: true })
    
    await prisma.post.delete({
      where: {
        post_channel_id_post_chat_id: {
          post_channel_id: post.post_channel_id,
          post_chat_id: post.post_chat_id,
        }
      }
    })
    await prisma.post.create({
      data: {
        channelId: channel_id.toString(),
        chatId: post.chatId,
        post_channel_id: source_id.toString(),
        post_chat_id: msg.message_id.toString(),
      }
    })
  })
})
console.log('Bot starting!')
bot.launch()
process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
