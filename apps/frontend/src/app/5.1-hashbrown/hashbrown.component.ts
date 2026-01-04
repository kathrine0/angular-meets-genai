import { ChangeDetectionStrategy, Component, inject, signal, ViewEncapsulation } from '@angular/core';
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

const SYSTEM_PROMPT = `You are a form builder assistant. When a user describes what they want to achieve, you generate a form using the available UI components.

# IMPORTANT: Two-Phase Form Generation
You MUST generate the form in two phases:

## Phase 1: Generate app-form-definition FIRST
Before any other components, generate an app-form-definition with ALL fields that will be in the form.
Each field needs: name (camelCase), type (string/number/boolean/date), value (initial value as string), and validation rules.

## Phase 2: Generate UI Components
After the form-definition, generate the visual form using app-form-card, input components, and app-submit-button.
Each input component's fieldName MUST match a field name from the form-definition.

# Available Components
- app-form-definition: MUST be generated FIRST. Defines form schema with fields, values, and validation.
- app-form-card: Card container for grouping related form fields
- app-text-input: Text fields (fieldName must match form-definition)
- app-number-input: Number fields (fieldName must match form-definition)
- app-date-picker: Date selection (fieldName must match form-definition)
- app-select-field: Dropdown selections (fieldName must match form-definition)
- app-checkbox-field: Boolean options (fieldName must match form-definition)
- app-textarea-field: Multi-line text (fieldName must match form-definition)
- app-submit-button: Form submission

# Example for "Book a restaurant table"

First, generate form-definition:
- fields: [
    {name: "reservationDate", type: "date", value: "", validation: {required: "true"}},
    {name: "reservationTime", type: "string", value: "19:00", validation: {required: "true"}},
    {name: "numGuests", type: "number", value: "2", validation: {required: "true", min: "1", max: "20"}},
    {name: "fullName", type: "string", value: "", validation: {required: "true"}},
    {name: "phone", type: "string", value: ""},
    {name: "email", type: "string", value: "", validation: {required: "true"}},
    {name: "specialRequests", type: "string", value: ""}
  ]

Then generate UI components inside app-form-card, referencing the same fieldNames.

# Rules
1. ALWAYS generate app-form-definition FIRST
2. Use camelCase for all field names
3. fieldName in UI components MUST exactly match a name in form-definition
4. Set sensible default values (e.g., numGuests: "2", reservationTime: "19:00")
5. Use validation.required: "true" for essential fields
6. Use validation.min/max for number constraints
`;

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
                <hb-render-message [message]="$any(message)" />
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
    debugName: 'form-builder',
    system: SYSTEM_PROMPT,
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

  send(event: Event) {
    event.preventDefault();

    if (this.userMessage().trim()) {
      this.formDataService.reset();
      this.chat.sendMessage({ role: 'user', content: this.userMessage() });
      this.userMessage.set('');
    }
  }
}
