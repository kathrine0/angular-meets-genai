import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';
import { Body, Controller, Get, Inject, Post } from '@nestjs/common';
import OpenAI from 'openai';
import { ResponseInput } from 'openai/resources/responses/responses';

@Controller('openai')
export class OpenAiController {
  private readonly client: OpenAI;

  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {
    this.client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  @Post()
  chat(@Body() messages: ResponseInput) {
    return this.client.responses.create({
      model: 'gpt-4.1',
      input: messages,
    });
  }

  @Post('image')
  generateImage(@Body() body: { prompt: string }) {
    return this.client.images.generate({
      prompt: body.prompt,
      n: 1,
      size: '1024x1024',
      response_format: 'b64_json',
    });
  }
}
