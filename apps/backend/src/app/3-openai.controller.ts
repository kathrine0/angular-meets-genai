import { Body, Controller, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import OpenAI, { APIPromise } from 'openai';
import { OPENAI_MODEL } from './settings';

@Controller('openai')
export class OpenAiController {
  private readonly client: OpenAI;

  // https://platform.openai.com/settings/organization/billing/overview
  // https://platform.openai.com/settings/proj_Vl1LZWKRZFH5M4u05lOxWM8K/api-keys

  constructor() {
    this.client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  @Post()
  async chat(
    @Body() messages: Array<OpenAI.ChatCompletionMessageParam>,
    @Res() res: Response
  ) {
    const stream = await this.client.chat.completions.create({
      model: OPENAI_MODEL,
      messages: messages,
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








  
  @Post('image')
  generateImage(
    @Body() body: { prompt: string }
  ): APIPromise<OpenAI.Images.ImagesResponse> {
    return this.client.images.generate({
      prompt: body.prompt,
      n: 1,
      size: '1024x1024',
      response_format: 'b64_json',
    });
  }
}
