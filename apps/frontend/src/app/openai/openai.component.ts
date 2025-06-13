import { HttpClient } from '@angular/common/http';
import { Component, inject, DestroyRef, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { take } from 'rxjs';
import { ChatComponent, Conversation } from '../components/chat.component';

const apiUrl = '/api/openai';

@Component({
  selector: 'app-openai',
  standalone: true,
  template: `
    <app-chat
      [conversation]="conversation()"
      (prompt)="onPrompt($event)"
    ></app-chat>
  `,
  imports: [ChatComponent],
})
export class OpenaiComponent {
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
      .post<string>(`${apiUrl}`, this.conversation())
      .pipe(takeUntilDestroyed(this.destroyRef), take(1))
      .subscribe((response: any) => {
        this.conversation.update((prev) => [
          ...prev,
          {
            role: 'assistant',
            content: response.output_text,
          },
        ]);
      });
  }
}
