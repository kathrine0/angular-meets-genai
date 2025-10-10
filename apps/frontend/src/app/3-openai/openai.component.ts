import { Component, computed, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ChatComponent, Conversation } from '../components/chat.component';
import { StreamHelper } from '../stream.helper';

// Slides before

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
  private destroyRef = inject(DestroyRef);
  private streamHelper = inject(StreamHelper);

  chatHistory = signal<Conversation[]>([
    {
      role: 'system',
      content: 'you are a helpful assistant. Format your answers in markdown',
    },
  ]);

  streamedAnswer = signal<string>('');

  conversation = computed<Conversation[]>(() =>
    this.streamedAnswer()
      ? [
          ...this.chatHistory(),
          { role: 'assistant', content: this.streamedAnswer() },
        ]
      : this.chatHistory()
  );

  onPrompt(prompt: string): void {
    this.chatHistory.update((prev) => [
      ...prev,
      { role: 'user', content: prompt },
    ]);

    this.streamHelper
      .stream(apiUrl, this.conversation())
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
}
