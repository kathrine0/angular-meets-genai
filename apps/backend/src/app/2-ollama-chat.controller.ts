import { Body, Controller, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import ollama, { ChatResponse, Message } from 'ollama';
import { OLLAMA_MODEL } from './settings';

@Controller('ollama-chat')
export class OllamaChatController {
  @Post()
  chat(@Body() messages: Message[]): Promise<ChatResponse> {
    return ollama.chat({
      model: OLLAMA_MODEL,
      messages: messages,
      stream: false,
    });
  }

  @Post('stream')
  async stream(@Body() messages: Message[], @Res() res: Response) {
    const result = await ollama.chat({
      model: OLLAMA_MODEL,
      messages: messages,
      stream: true,
    });

    res.header('Content-Type', 'application/octet-stream');

    for await (const chunk of result) {
      res.write(chunk.message.content);
    }

    return res.end();
  }
}
