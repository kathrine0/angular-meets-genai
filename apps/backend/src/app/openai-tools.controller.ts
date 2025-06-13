import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';
import { Body, Controller, Inject, Post } from '@nestjs/common';
import OpenAI from 'openai';
import { ResponseInput } from 'openai/resources/responses/responses';
import { getTicketPrice, getTicketPriceDescription } from './tools';

@Controller('openai-tools')
export class OpenAiToolsController {
  private readonly client: OpenAI;

  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {
    this.client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  @Post()
  async chat(@Body() messages: ResponseInput) {
    const response = await this.client.responses.create({
      model: 'gpt-4.1',
      input: messages,
      tools: [getTicketPriceDescription],
    });

    if (response.output[0].type === 'function_call') {
      return await this.callWithToolResponse(messages, response.output[0]);
    }

    return response;
  }

  private async callWithToolResponse(
    messages: ResponseInput,
    functionCall: OpenAI.Responses.ResponseFunctionToolCall,
  ) {
    messages.push(functionCall);

    if (functionCall.name === 'getTicketPrice') {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      const city: string = JSON.parse(functionCall.arguments).city;
      const result = getTicketPrice(city);

      messages.push({
        type: 'function_call_output',
        output: result,
        call_id: functionCall.call_id,
      });
    }

    return await this.client.responses.create({
      model: 'gpt-4.1',
      input: messages,
      tools: [getTicketPriceDescription],
    });
  }
}
