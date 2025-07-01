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
})
export class OllamaChatComponent {
  conversation = signal<Conversation[]>([]);

  onPrompt(prompt: string) {
    this.conversation.update((prev) => [
      ...prev,
      { role: 'user', content: prompt },
    ]);
  }

  // private httpClient = inject(HttpClient);
  // private destroyRef = inject(DestroyRef);

  // onPrompt(prompt: string): void {
  //   this.conversation.update((prev) => [
  //     ...prev,
  //     { role: 'user', content: prompt },
  //   ]);

  //   this.httpClient
  //     .post<ChatResponse>(`${apiUrl}`, [{ role: 'user', content: prompt }])
  //     .pipe(takeUntilDestroyed(this.destroyRef), take(1))
  //     .subscribe((response) => {
  //       this.conversation.update((prev) => [
  //         ...prev,
  //         {
  //           role: 'assistant',
  //           content: response.message.content,
  //         },
  //       ]);
  //     });
  // }

  // .post<ChatResponse>(`${apiUrl}`, this.conversation())

  // conversation = signal<Conversation[]>([
  //   {
  //     role: 'system', // available roles: "system" | "user" | "assistant"
  //     content: 'you are a helpful assistant. Format your answers in markdown',
  //   },
  // ]);
}
