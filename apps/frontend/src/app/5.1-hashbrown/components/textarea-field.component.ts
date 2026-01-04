import { Component, computed, inject, input } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Field } from '@angular/forms/signals';
import { exposeComponent } from '@hashbrownai/angular';
import { s } from '@hashbrownai/core';
import { FormDataService } from '../form-data.service';
import { SignalFormErrorStateMatcher } from '../signal-form-error-state-matcher';

@Component({
  selector: 'app-textarea-field',
  imports: [MatFormFieldModule, MatInputModule, Field],
  template: `
    @if (fieldRef(); as field) {
      <mat-form-field class="full-width">
        <mat-label>{{ label() }}</mat-label>
        <textarea
          matInput
          [placeholder]="placeholder()"
          [rows]="rows()"
          [field]="field"
          [errorStateMatcher]="errorMatcher"
        ></textarea>
        @if (hint()) {
          <mat-hint>{{ hint() }}</mat-hint>
        }
        @for (error of field().errors(); track error.kind) {
          <mat-error>{{ error.message }}</mat-error>
        }
      </mat-form-field>
    }
  `,
})
export class TextareaFieldComponent {
  private readonly formDataService = inject(FormDataService);

  label = input.required<string>();
  placeholder = input.required<string>();
  rows = input.required<number>();
  hint = input.required<string>();
  fieldName = input.required<string>();

  fieldRef = computed(() => {
    const name = this.fieldName();
    return name ? this.formDataService.getField<string>(name) : undefined;
  });

  errorMatcher = new SignalFormErrorStateMatcher(() => this.fieldRef());
}

export const exposedTextareaField = exposeComponent(TextareaFieldComponent, {
  description:
    'A multi-line text area. The value comes from the form-definition schema.',
  input: {
    label: s.string('The label displayed above the textarea'),
    placeholder: s.string('Placeholder text'),
    rows: s.number('Number of visible text rows'),
    hint: s.string('Helper text displayed below (empty string if none)'),
    fieldName: s.string(
      'The field name matching a field in the form-definition',
    ),
  },
});
