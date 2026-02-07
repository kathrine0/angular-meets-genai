import { Body, Controller, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import ollama, { Message } from 'ollama';
import { OLLAMA_MODEL } from './settings';

@Controller('ollama-chat')
export class OllamaChatController {
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
