import { Body, Controller, Post } from '@nestjs/common';
import OpenAI from 'openai';
import { ResponseInput } from 'openai/resources/responses/responses';
import { getTicketPrice, getTicketPriceDescription } from './tools';

@Controller('openai-tools')
export class OpenAiToolsController {
  private readonly client: OpenAI;

  constructor() {
    this.client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  // System prompt:
  // You are a helpful assistant for an Airline called FlightAI.
  // Give short, courteous answers, no more than 1 sentence.
  // Always be accurate. If you don't know the answer, say so.

  private async promptOpenAi(messages: ResponseInput) {
    return await this.client.responses.create({
      model: 'gpt-4.1',
      input: messages,
      tools: [getTicketPriceDescription],
    });
  }

  @Post()
  async chat(@Body() messages: ResponseInput) {
    const response = await this.promptOpenAi(messages);
    // debugger;


    return response;
  }













  // if (response.output[0].type === 'function_call') {
  //   return await this.callWithToolResponse(messages, response.output[0]);
  // }
  private async callWithToolResponse(
    messages: ResponseInput,
    functionCall: OpenAI.Responses.ResponseFunctionToolCall,
  ) {
    messages.push(functionCall);

    if (functionCall.name === 'getTicketPrice') {
      const city: string = JSON.parse(functionCall.arguments).city;
      const result = getTicketPrice(city);

      messages.push({
        type: 'function_call_output',
        output: result,
        call_id: functionCall.call_id,
      });
    }

    return await this.promptOpenAi(messages);
  }
}
