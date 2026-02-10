import { Body, Controller, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import ollama from 'ollama';
import { OLLAMA_MODEL } from './settings';

@Controller('ollama')
export class OllamaController {
  @Post()
  async getOllama(
    @Body() { prompt }: { prompt: string },
    @Res() res: Response,
  ) {
    const result = await ollama.generate({
      model: OLLAMA_MODEL,
      prompt: prompt,
      stream: true,
    });

    res.header('Content-Type', 'application/octet-stream');

    for await (const chunk of result) {
      res.write(chunk.response);
    }

    return res.end();
  }
}
