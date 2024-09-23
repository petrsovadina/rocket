'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { type Chat } from '@/lib/types'
import { Redis } from '@upstash/redis'

let redis: Redis | null = null;

// Funkce pro inicializaci Redis klienta
const initRedis = (): Redis | null => {
  if (!redis && process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
    redis = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN
    });
  }
  return redis;
}

export async function getChats(userId?: string | null) {
  const redisClient = initRedis();
  if (!redisClient || !userId) {
    return []
  }

  try {
    const pipeline = redisClient.pipeline()
    const chats: string[] = await redisClient.zrange(`user:chat:${userId}`, 0, -1, {
      rev: true
    })

    for (const chat of chats) {
      pipeline.hgetall(chat)
    }

    const results = await pipeline.exec()

    return results as Chat[]
  } catch (error) {
    console.error('Chyba při získávání chatů:', error);
    return []
  }
}

export async function getChat(id: string, userId: string = 'anonymous') {
  const redisClient = initRedis();
  if (!redisClient) {
    return null;
  }
  const chat = await redisClient.hgetall<Chat>(`chat:${id}`)

  if (!chat) {
    return null
  }

  return chat
}

export async function clearChats(
  userId: string = 'anonymous'
): Promise<{ error?: string }> {
  const redisClient = initRedis();
  if (!redisClient) {
    return { error: 'Nelze se připojit k Redis' };
  }

  try {
    const chats: string[] = await redisClient.zrange(`user:chat:${userId}`, 0, -1);
    if (!chats.length) {
      return { error: 'Žádné chaty k vymazání' };
    }

    const pipeline = redisClient.pipeline();
    for (const chat of chats) {
      pipeline.del(chat);
    }
    pipeline.del(`user:chat:${userId}`);

    await pipeline.exec();

    return {};
  } catch (error) {
    console.error('Chyba při mazání chatů:', error);
    return { error: 'Nastala chyba při mazání chatů' };
  }
}

export async function saveChat(chat: Chat, userId: string = 'anonymous') {
  const redisClient = initRedis();
  if (!redisClient) {
    console.error('Nelze se připojit k Redis');
    return;
  }
  
  const pipeline = redisClient.pipeline()
  pipeline.hmset(`chat:${chat.id}`, chat)
  pipeline.zadd(`user:chat:${chat.userId}`, {
    score: Date.now(),
    member: `chat:${chat.id}`
  })
  await pipeline.exec()
}

export async function getSharedChat(id: string) {
  const redisClient = initRedis();
  if (!redisClient) {
    console.error('Nelze se připojit k Redis');
    return null;
  }
  
  const chat = await redisClient.hgetall<Chat>(`chat:${id}`)

  if (!chat || !chat.sharePath) {
    return null
  }

  return chat
}

export async function shareChat(id: string, userId: string = 'anonymous') {
  const redisClient = initRedis();
  if (!redisClient) {
    console.error('Nelze se připojit k Redis');
    return null;
  }
  
  const chat = await redisClient.hgetall<Chat>(`chat:${id}`)

  if (!chat || chat.userId !== userId) {
    return null
  }

  const payload = {
    ...chat,
    sharePath: `/share/${id}`
  }

  await redisClient.hmset(`chat:${id}`, payload)

  return payload
}
