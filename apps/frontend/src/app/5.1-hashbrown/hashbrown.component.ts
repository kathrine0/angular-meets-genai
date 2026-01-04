import { ChangeDetectionStrategy, Component, effect, inject, signal, ViewEncapsulation } from '@angular/core';
import {
  uiChatResource,
  RenderMessageComponent,
  provideHashbrown,
} from '@hashbrownai/angular';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FormDataService } from './form-data.service';

import {
  exposedFormDefinition,
  exposedTextInput,
  exposedNumberInput,
  exposedDatePicker,
  exposedSelectField,
  exposedCheckboxField,
  exposedTextareaField,
  exposedFormCard,
  exposedSubmitButton,
} from './components';

@Component({
  selector: 'app-hashbrown',
  template: `
    <div class="hashbrown-container">
      <form class="input-form" (submit)="send($event)">
        <mat-form-field class="prompt-field">
          <mat-label>What would you like to do?</mat-label>
          <input
            matInput
            type="text"
            [value]="userMessage()"
            (input)="userMessage.set($any($event.target).value)"
            placeholder="e.g., I want to book a table at a restaurant..."
          />
        </mat-form-field>
        <button mat-flat-button type="submit" [disabled]="chat.isLoading()">
          @if (chat.isLoading()) {
            <mat-spinner diameter="20" />
          } @else {
            Generate Form
          }
        </button>
      </form>

      <div class="messages-container">
        @for (message of chat.value(); track $index) {
          @switch (message.role) {
            @case ('user') {
              <div class="user-message">
                <strong>You:</strong> {{ message.content }}
              </div>
            }
            @case ('assistant') {
              <div class="assistant-message">
                <hb-render-message [message]="message" />
              </div>
            }
          }
        }
      </div>
    </div>
  `,
  imports: [
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    RenderMessageComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  styleUrl: './hashbrown.component.scss',
  providers: [
    provideHashbrown({
      baseUrl: '/api/hashbrown/chat',
    }),
    FormDataService,
  ],
})
export class HashbrownComponent {
  private readonly formDataService = inject(FormDataService);

  userMessage = signal<string>('');

  chat = uiChatResource({
    model: 'gpt-4.1',
    system: 'You are a helpful assistant that helps the user build a form.',
    components: [
      exposedFormDefinition, // MUST be first - defines the form schema
      exposedFormCard,
      exposedTextInput,
      exposedNumberInput,
      exposedDatePicker,
      exposedSelectField,
      exposedCheckboxField,
      exposedTextareaField,
      exposedSubmitButton,
    ],
  });

  constructor() {
    // Debug: Log AI responses to console
    // effect(() => {
    //   console.log('Messages:', this.chat.value());
    // });
  }

  send(event: Event) {
    event.preventDefault();

    if (this.userMessage().trim()) {
      this.formDataService.reset();
      this.chat.sendMessage({ role: 'user', content: this.userMessage() });
      this.userMessage.set('');
    }
  }
}
