import {
  Component,
  DestroyRef,
  ElementRef,
  inject,
  model,
  signal,
  viewChild,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import OpenAI from 'openai';
import { OSModelStreamService } from './code-gen-stream.service';

@Component({
  selector: 'app-code-gen',
  template: `
    <form>
      <mat-form-field>
        <mat-label>What would you like to do?</mat-label>
        <input matInput type="text" #input name="prompt" />
      </mat-form-field>
      <br />
      <button mat-flat-button (click)="onPrompt($event, input.value)">
        Go!
      </button>
    </form>

    <br />
    <div class="result">
      <mat-form-field>
        <mat-label>Result</mat-label>
        <textarea
          matInput
          #input
          name="result"
          [(ngModel)]="currentAnswer"
        ></textarea>
      </mat-form-field>
      <button
        mat-flat-button
        (click)="onExecute()"
        [disabled]="!generateCodeButtonEnabled()"
      >
        Execute
      </button>
    </div>

    <br />
    <div #executionContainer></div>
  `,
  styles: [
    `
      form {
        display: flex;
        gap: 1rem;
        align-items: center;
      }

      mat-form-field {
        flex: 1;
      }

      .result {
        display: flex;
        flex-direction: column;
        gap: 1rem;
      }

      textarea {
        min-height: 300px;
      }
    `,
  ],
  imports: [MatFormFieldModule, MatInputModule, MatButtonModule, FormsModule],
})
export class CodeGenComponent {
  private destroyRef = inject(DestroyRef);
  private service = inject(OSModelStreamService);

  private systemPrompt = `You are tasked with creating an HTML code snippet that fulfills the task given by the human.
                You will receive a prompt from the human, and you should respond with an HTML code snippet that meets the requirements.
                The code snippet should be written in HTML with inline CSS and should be compatible with modern web standards.
                Don't include <html>, <head>, or <body> tags in your response, only the HTML code snippet.
                Answer only with the code, no explanations, no additional text.`;

  currentAnswer = model<string>('');
  generateCodeButtonEnabled = signal<boolean>(false);
  resultDiv = signal<string>('');

  private executionContainer =
    viewChild<ElementRef<HTMLElement>>('executionContainer');

  onPrompt(event: Event, prompt: string): void {
    event.preventDefault();

    this.currentAnswer.set('');
    this.resultDiv.set('');

    const messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
      {
        role: 'system',
        content: this.systemPrompt,
      },
      {
        role: 'user',
        content: prompt,
      },
    ];

    this.service
      .askQuestion(messages)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => {
          this.currentAnswer.update((prev) => prev + response);
        },
        error: (error) => {
          console.error('Error:', error);
        },
        complete: () => {
          this.generateCodeButtonEnabled.set(true);
        },
      });
  }

  onExecute(): void {
    const ec = this.executionContainer();
    if (ec) {
      ec.nativeElement.innerHTML = this.currentAnswer();
    }
  }
}
