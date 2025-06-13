import { HttpClient } from '@angular/common/http';
import { Component, inject, DestroyRef, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { take } from 'rxjs';
import { ChatComponent, Conversation } from '../components/chat.component';

const apiUrl = 'http://localhost:3000/openai-tools';

@Component({
  selector: 'app-openai-tools',
  template: `
    <app-chat
      [conversation]="conversation()"
      (prompt)="onPrompt($event)"
    ></app-chat>
  `,
  imports: [ChatComponent],
})
export class OpenaiToolsComponent {
  private httpClient = inject(HttpClient);
  private destroyRef = inject(DestroyRef);

  conversation = signal<Conversation[]>([
    {
      role: 'system',
      content: `
        You are a helpful assistant for an Airline called FlightAI.
        Give short, courteous answers, no more than 1 sentence.
        Always be accurate. If you don't know the answer, say so.
      `,
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
        // console.log(response.output[0]);

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
