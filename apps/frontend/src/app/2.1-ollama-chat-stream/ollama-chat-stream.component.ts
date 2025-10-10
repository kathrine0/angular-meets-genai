import {
  HttpClient,
  HttpDownloadProgressEvent,
  HttpEvent,
  HttpEventType,
  HttpResponse,
} from '@angular/common/http';
import { Component, computed, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { filter, map } from 'rxjs/operators';
import { ChatComponent, Conversation } from '../components/chat.component';

const apiUrl = '/api/ollama-chat/stream';

@Component({
  selector: 'app-ollama-chat-stream',
  template: `
    <app-chat
      [conversation]="conversation()"
      (prompt)="onPrompt($event)"
    ></app-chat>
  `,
  imports: [ChatComponent],
  providers: [],
})
export class OllamaChatStreamComponent {
  chatHistory = signal<Conversation[]>([
    {
      role: 'system',
      content: 'you are a witty assistant. Format your answers in markdown',
    },
  ]);

  // conversation = computed<Conversation[]>(() => this.chatHistory());

  streamedAnswer = signal<string>('');
  conversation = computed<Conversation[]>(() =>
    this.streamedAnswer()
      ? [
          ...this.chatHistory(),
          { role: 'assistant', content: this.streamedAnswer() },
        ]
      : this.chatHistory()
  );

  private httpClient = inject(HttpClient);
  private destroyRef = inject(DestroyRef);

  onPrompt(prompt: string): void {
    this.chatHistory.update((prev) => [
      ...prev,
      { role: 'user', content: prompt },
    ]);

    this.httpClient
      .post(`${apiUrl}`, this.chatHistory(), {
        responseType: 'text',
        observe: 'events',
        reportProgress: true,
      })
      .pipe(
        filter(
          (event: HttpEvent<string>): boolean =>
            event.type === HttpEventType.DownloadProgress ||
            event.type === HttpEventType.Response
        ),
        map((event: HttpEvent<string>) => {
          if (event.type === HttpEventType.DownloadProgress) {
            return {
              response: (event as HttpDownloadProgressEvent).partialText ?? '',
              generating: true,
            };
          } else {
            return {
              response: (event as HttpResponse<string>).body ?? '',
              generating: false,
            };
          }
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(({ response, generating }) => {
        if (generating) {
          this.streamedAnswer.set(response);
        } else {
          this.chatHistory.update((prev) => [
            ...prev,
            { role: 'assistant', content: response },
          ]);
          this.streamedAnswer.set('');
        }
      });
  }
}
