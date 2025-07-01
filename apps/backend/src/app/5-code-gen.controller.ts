import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';
import { Body, Controller, Inject, Param, Post, Sse } from '@nestjs/common';
import OpenAI from 'openai';
import { concat, concatMap, from, map, of } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';

@Controller('code-gen')
export class CodeGenController {
  private client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  @Post('create-stream')
  async createStream(
    @Body() messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[]
  ): Promise<{ streamId: string }> {
    const streamId = uuidv4();
    await this.cacheManager.set(streamId, messages);

    return { streamId };
  }

  @Sse('stream/:streamId')
  async getStream(@Param('streamId') streamId: string) {
    const messages = await this.cacheManager.get<
      OpenAI.Chat.Completions.ChatCompletionMessageParam[]
    >(streamId);

    if (!messages) {
      throw new Error('Stream not found');
    }

    console.log(messages);
    await this.cacheManager.del(streamId);

    const stream$ = from(
      this.client.chat.completions.create({
        model: 'gpt-4.1-mini',
        messages,
        stream: true,
      })
    ).pipe(
      concatMap((response) =>
        from(response).pipe(
          map((chunk) => chunk.choices[0]?.delta?.content || '')
        )
      )
    );

    return concat(stream$, of({ data: '[DONE]' }));
  }
}
