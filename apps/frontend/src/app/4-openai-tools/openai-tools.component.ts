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

const apiUrl = 'api/openai-tools';

@Component({
  selector: 'app-openai-tools',
  template: `
    <app-chat
      [conversation]="conversation()"
      (prompt)="onPrompt($event)"
    ></app-chat>
  `,
  imports: [ChatComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OpenaiToolsComponent {
  private destroyRef = inject(DestroyRef);
  private streamHelper = inject(StreamHelper);

  chatHistory = signal<Conversation[]>([
    {
      role: 'system',
      content: `
        You are a helpful assistant for an Airline called FlightAI.
        Give short, courteous answers, no more than 1 sentence.
        Always be accurate. If you don't know the answer, say so.
      `,
    },
  ]);

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
      .stream(`${apiUrl}`, this.conversation())
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
