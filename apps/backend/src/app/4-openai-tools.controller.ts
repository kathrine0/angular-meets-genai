import { Body, Controller, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import OpenAI from 'openai';
import { ChatCompletionMessageParam } from 'openai/resources/chat/completions';
import { OPENAI_MODEL } from './settings';
import { getTicketPrice, getTicketPriceDescription } from './tools';

@Controller('openai-tools')
export class OpenAiToolsController {
  private readonly client: OpenAI;

  constructor() {
    this.client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  private async promptOpenAi(messages: ChatCompletionMessageParam[]) {
    return await this.client.chat.completions.create({
      model: OPENAI_MODEL,
      messages,
      tools: [getTicketPriceDescription],
      stream: true,
    });
  }

  @Post()
  async chat(
    @Body() messages: ChatCompletionMessageParam[],
    @Res() res: Response,
  ) {
    res.header('Content-Type', 'application/octet-stream');

    try {
      // Phase 1: Handle tool calls in a non-streaming loop
      // This resolves all tool calls before we start streaming.
      while (true) {
        const response = await this.client.chat.completions.create({
          model: OPENAI_MODEL,
          messages,
          tools: [getTicketPriceDescription],
        });

        const message = response.choices[0].message;

        // No tool calls — tool resolution is done, move to streaming
        if (!message.tool_calls || message.tool_calls.length === 0) {
          break;
        }

        // Add the assistant's tool-call message to the conversation
        messages.push(message);

        // Execute each tool and append the result
        for (const toolCall of message.tool_calls) {
          if (toolCall.type !== 'function') continue;

          const args = JSON.parse(toolCall.function.arguments);
          let result: string;

          if (toolCall.function.name === 'getTicketPrice') {
            result = getTicketPrice(args.city);
          } else {
            result = 'Unknown function';
          }

          messages.push({
            role: 'tool',
            content: result,
            tool_call_id: toolCall.id,
          });
        }
      }

      // Phase 2: Stream the final answer (all tools already resolved)
      const stream = await this.promptOpenAi(messages);

      for await (const chunk of stream) {
        const content = chunk.choices[0]?.delta?.content;
        if (content) {
          res.write(content);
        }
      }

      return res.end();
    } catch (error) {
      console.error('Error in openai-tools chat:', error);
      if (!res.headersSent) {
        res.status(500).json({ error: 'Internal server error' });
      } else {
        res.end();
      }
    }
  }
}
