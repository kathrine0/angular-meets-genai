import { Chat } from '@hashbrownai/core';
import { HashbrownOpenAI } from '@hashbrownai/openai';
import { Body, Controller, Post, Res } from '@nestjs/common';
import { Response } from 'express';

@Controller('hashbrown')
export class HashbrownController {
  @Post('chat')
  async chat(
    @Body() body: Chat.Api.CompletionCreateParams,
    @Res() res: Response,
  ) {
    const stream = HashbrownOpenAI.stream.text({
      apiKey: process.env.OPENAI_API_KEY,
      request: body,
    });

    res.header('Content-Type', 'application/octet-stream');

    for await (const chunk of stream) {
      res.write(chunk);
    }

    res.end();
  }
}
