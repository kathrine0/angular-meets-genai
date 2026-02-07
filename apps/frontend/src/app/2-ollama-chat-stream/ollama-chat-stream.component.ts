import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  inject,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ChatComponent, Conversation } from '../components/chat.component';
import { StreamHelper } from '../stream.helper';

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
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OllamaChatStreamComponent {
  private destroyRef = inject(DestroyRef);
  private streamHelper = inject(StreamHelper);

  chatHistory = signal<Conversation[]>([]);

  streamedAnswer = signal<string>('');
  conversation = computed<Conversation[]>(() =>
    this.streamedAnswer()
      ? [
          ...this.chatHistory(),
          { role: 'assistant', content: this.streamedAnswer() },
        ]
      : this.chatHistory(),
  );

  onPrompt(prompt: string): void {
    this.chatHistory.update((prev) => [
      ...prev,
      { role: 'user', content: prompt },
    ]);

    this.streamHelper
      .stream(apiUrl, [{ role: 'user', content: prompt }])
      .pipe(takeUntilDestroyed(this.destroyRef))
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

  // chatHistory = signal<Conversation[]>([
  //   {
  //     role: 'system',
  //     content: 'jesteś zrzędliwym asystentem. Formatuj odpowiedzi w markdown',
  //   },
  // ]);
}
