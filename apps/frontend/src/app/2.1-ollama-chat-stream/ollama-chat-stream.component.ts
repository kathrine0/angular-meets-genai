import { Component, computed, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ChatComponent, Conversation } from '../components/chat.component';
import { OllamaChatStreamService } from './ollama-chat-stream.service';

@Component({
  selector: 'app-ollama-chat-stream',
  template: `
    <app-chat
      [conversation]="visibleConversation()"
      (prompt)="onPrompt($event)"
    ></app-chat>
  `,
  imports: [ChatComponent],
  providers: [],
})
export class OllamaChatStreamComponent {
  private service = inject(OllamaChatStreamService);
  private destroyRef = inject(DestroyRef);

  visibleConversation = computed<Conversation[]>(() =>
    this.currentAnswer()
      ? [
          ...this.conversation(),
          { role: 'assistant', content: this.currentAnswer() },
        ]
      : this.conversation()
  );

  conversation = signal<Conversation[]>([
    {
      role: 'system',
      content: 'you are a grumpy assistant. Format your answers in markdown',
    },
  ]);

  currentAnswer = signal<string>('');

  onPrompt(prompt: string): void {
    this.conversation.update((prev) => [
      ...prev,
      { role: 'user', content: prompt },
    ]);

    this.service
      .askQuestion(this.conversation())
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => {
          this.currentAnswer.update((prev) => prev + response);
        },
        error: (error) => {
          console.error('Error:', error);
        },
        complete: () => {
          this.conversation.update((prev) => [
            ...prev,
            {
              role: 'assistant',
              content: this.currentAnswer(),
            },
          ]);
          this.currentAnswer.set('');
          console.log('Streaming completed');
        },
      });
  }
}
