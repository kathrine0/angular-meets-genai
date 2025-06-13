import { HttpClient } from '@angular/common/http';
import { Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ChatResponse } from 'ollama';
import { take } from 'rxjs';
import { ChatComponent, Conversation } from '../components/chat.component';

const apiUrl = '/api/ollama-chat';

@Component({
  selector: 'app-ollama-chat',
  template: `
    <app-chat
      [conversation]="conversation()"
      (prompt)="onPrompt($event)"
    ></app-chat>
  `,
  imports: [ChatComponent],
  providers: [],
})
export class OllamaChatComponent {
  // TODO
  // simple chat with no history
  // add history
  // add system prompt

  private httpClient = inject(HttpClient);
  private destroyRef = inject(DestroyRef);

  conversation = signal<Conversation[]>([
    {
      role: 'system',
      content: 'you are a helpful assistant. Format your answers in markdown',
    },
  ]);

  onPrompt(prompt: string): void {
    this.conversation.update((prev) => [
      ...prev,
      { role: 'user', content: prompt },
    ]);

    this.httpClient
      .post<ChatResponse>(`${apiUrl}`, this.conversation())
      .pipe(takeUntilDestroyed(this.destroyRef), take(1))
      .subscribe((response: ChatResponse) => {
        this.conversation.update((prev) => [
          ...prev,
          {
            role: 'assistant',
            content: response.message.content,
          },
        ]);
      });
  }
}
