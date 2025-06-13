import { Controller, Get } from '@nestjs/common';
import ollama, { GenerateResponse } from 'ollama';
import { from, Observable } from 'rxjs';

const LLAMA_MODEL = 'llama3.2';

@Controller('ollama')
export class OllamaController {
  @Get()
  getOllama(): Observable<GenerateResponse> {
    const prompt = 'What is generative AI?';

    return from(
      ollama.generate({
        model: LLAMA_MODEL,
        prompt: prompt,
      }),
    );
  }
}
