import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { OllamaController } from './ollama.controller';
import { OllamaChatController } from './ollama-chat.controller';
import { OpenAiController } from './openai.controller';
import { ConfigModule } from '@nestjs/config';
import { OpenAiToolsController } from './openai-tools.controller';

@Module({
  imports: [CacheModule.register(), ConfigModule.forRoot()],
  controllers: [
    AppController,
    OllamaController,
    OllamaChatController,
    OpenAiController,
    OpenAiToolsController,
  ],
  providers: [AppService],
})
export class AppModule {}
