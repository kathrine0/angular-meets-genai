import { Body, Controller, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import OpenAI from 'openai';

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
    res.setHeader('Content-Type', 'application/x-ndjson');
    res.setHeader('Transfer-Encoding', 'chunked');
    res.flushHeaders();

    const stream = await this.client.chat.completions.create({
      model: 'gpt-4.1-mini',
      messages,
      stream: true,
    });

    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content;
      if (content) {
        res.write(content);
      }
    }

    return res.end();
  }
}
