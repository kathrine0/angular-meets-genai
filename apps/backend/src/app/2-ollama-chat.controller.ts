import { Body, Controller, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import ollama, { ChatResponse, Message } from 'ollama';

const LLAMA_MODEL = 'llama3.2';

@Controller('ollama-chat')
export class OllamaChatController {
  @Post()
  chat(@Body() messages: Message[]): Promise<ChatResponse> {
    return ollama.chat({
      model: LLAMA_MODEL,
      messages: messages,
      stream: false,
    });
  }

  @Post('stream')
  async stream(@Body() messages: Message[], @Res() res: Response) {
    res.setHeader('Content-Type', 'application/x-ndjson');
    res.setHeader('Transfer-Encoding', 'chunked');
    res.flushHeaders();

    const result = await ollama.chat({
      model: LLAMA_MODEL,
      messages: messages,
      stream: true,
    });

    for await (const chunk of result) {
      res.write(chunk.message.content);
    }

    return res.end();
  }
}
