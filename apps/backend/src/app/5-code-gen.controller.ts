import { Body, Controller, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import OpenAI from 'openai';
import { OPENAI_MODEL } from './settings';

@Controller('code-gen')
export class CodeGenController {
  private client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  @Post()
  async chat(
    @Body() messages: Array<OpenAI.ChatCompletionMessageParam>,
    @Res() res: Response
  ) {
    const stream = await this.client.chat.completions.create({
      model: OPENAI_MODEL,
      messages,
      stream: true,
    });

    res.header('Content-Type', 'application/octet-stream');

    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content;
      if (content) {
        res.write(content);
      }
    }

    return res.end();
  }
}
