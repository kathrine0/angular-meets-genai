import { Component, computed, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ChatComponent, Conversation } from '../components/chat.component';
import { OllamaChatStreamService } from './ollama-chat-stream.service';

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
  private service = inject(OllamaChatStreamService);
  private destroyRef = inject(DestroyRef);


  chatHistory = signal<Conversation[]>([
    {
      role: 'system',
      content: 'you are a grumpy assistant. Format your answers in markdown',
    },
  ]);

  conversation = computed<Conversation[]>(() => this.chatHistory());

  // streamedAnswer = signal<string>('');

  // conversation = computed<Conversation[]>(() =>
  //   this.streamedAnswer()
  //     ? [
  //         ...this.chatHistory(),
  //         { role: 'assistant', content: this.streamedAnswer() },
  //       ]
  //     : this.chatHistory()
  // );


  onPrompt(prompt: string): void {
    this.chatHistory.update((prev) => [
      ...prev,
      { role: 'user', content: prompt },
    ]);

    this.service
      .askQuestion(this.chatHistory())
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(console.log);

      // .subscribe({
      //   next: (response) => {
      //     this.streamedAnswer.update((prev) => prev + response);
      //   },
      //   error: (error) => {
      //     console.error('Error:', error);
      //   },
      //   complete: () => {
      //     this.chatHistory.update((prev) => [
      //       ...prev,
      //       {
      //         role: 'assistant',
      //         content: this.streamedAnswer(),
      //       },
      //     ]);
      //     this.streamedAnswer.set('');
      //     console.log('Streaming completed');
      //   },
      // });

      // Go to slides :)
  }
}
