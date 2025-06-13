import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { OllamaController } from './1-ollama.controller';
import { OllamaChatController } from './2-ollama-chat.controller';
import { OpenAiToolsController } from './4-openai-tools.controller';
import { OpenAiController } from './3-openai.controller';

@Module({
  imports: [CacheModule.register(), ConfigModule.forRoot()],
  controllers: [
    OllamaController,
    OllamaChatController,
    OpenAiController,
    OpenAiToolsController,
  ],
  providers: [],
})
export class AppModule {}
