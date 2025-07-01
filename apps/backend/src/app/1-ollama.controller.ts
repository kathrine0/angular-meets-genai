import { Controller, Get } from '@nestjs/common';
import ollama, { GenerateResponse } from 'ollama';

const LLAMA_MODEL = 'llama3.2';

@Controller('ollama')
export class OllamaController {
  @Get()
  getOllama(): Promise<GenerateResponse> {

    throw new Error('This endpoint is not implemented yet.');

    // const prompt = 'What is generative AI?';

    // return ollama.generate({
    //   model: LLAMA_MODEL,
    //   prompt: prompt,
    // });
  }
}
