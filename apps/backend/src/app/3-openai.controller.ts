import { Body, Controller, Post } from '@nestjs/common';
import OpenAI, { APIPromise } from 'openai';

@Controller('openai')
export class OpenAiController {
  private readonly client: OpenAI;

  // https://platform.openai.com/settings/organization/billing/overview
  // https://platform.openai.com/settings/proj_Vl1LZWKRZFH5M4u05lOxWM8K/api-keys

  constructor() {
    // this.client = new OpenAI({
    //   apiKey: process.env.OPENAI_API_KEY,
    // });
  }

  // @Post()
  // chat(
  //   @Body() messages: OpenAI.Responses.ResponseInput
  // ): APIPromise<OpenAI.Responses.Response> {
  //   return this.client.responses.create({
  //     model: 'gpt-4.1',
  //     input: messages,
  //   });
  // }

  // @Post('image')
  // generateImage(
  //   @Body() body: { prompt: string }
  // ): APIPromise<OpenAI.Images.ImagesResponse> {
  //   return this.client.images.generate({
  //     prompt: body.prompt,
  //     n: 1,
  //     size: '1024x1024',
  //     response_format: 'b64_json',
  //   });
  // }
}
