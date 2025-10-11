import { Controller, Get } from '@nestjs/common';
import ollama, { GenerateResponse } from 'ollama';

@Controller('ollama')
export class OllamaController {
  @Get()
  getOllama(): Promise<GenerateResponse> {
    throw new Error('This endpoint is not implemented yet.');

    // const prompt = 'What is generative AI? Keep the answer short and concise.';

    // return ollama.generate({
    //   model: 'llama3.2',
    //   prompt: prompt,
    // });
  }
}
