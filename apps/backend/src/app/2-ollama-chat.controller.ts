import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';
import { Body, Controller, Inject, Param, Post, Sse } from '@nestjs/common';
import ollama, { ChatResponse, Message } from 'ollama';
import { concat, concatMap, from, map, Observable, of } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';

const LLAMA_MODEL = 'llama3.2';

@Controller('ollama-chat')
export class OllamaChatController {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  @Post()
  chat(@Body() messages: Message[]): Observable<ChatResponse> {
    return from(
      ollama.chat({
        model: LLAMA_MODEL,
        messages: messages,
        stream: false,
      })
    );
  }

  @Post('create-stream')
  async createStream(@Body() messages: Message[]): Promise<{ streamId: string }> {
    const streamId = uuidv4();
    await this.cacheManager.set(streamId, messages);

    return { streamId };
  }

  @Sse('stream/:streamId')
  async getOllamaStream(@Param('streamId') streamId: string) {
    const messages = await this.cacheManager.get<Message[]>(streamId);

    if (!messages) {
      throw new Error('Stream not found');
    }

    await this.cacheManager.del(streamId);

    const ollamaStream$ = from(
      ollama.chat({
        model: LLAMA_MODEL,
        messages: messages,
        stream: true,
      })
    ).pipe(
      concatMap((response) =>
        from(response).pipe(map((chunk) => chunk.message.content || ''))
      )
    );

    return concat(ollamaStream$, of({ data: '[DONE]' }));
  }
}
