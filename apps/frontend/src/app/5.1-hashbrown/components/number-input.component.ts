import { Component, computed, inject, input } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Field } from '@angular/forms/signals';
import { exposeComponent } from '@hashbrownai/angular';
import { s } from '@hashbrownai/core';
import { FormDataService } from '../form-data.service';
import { SignalFormErrorStateMatcher } from '../signal-form-error-state-matcher';

@Component({
  selector: 'app-number-input',
  imports: [MatFormFieldModule, MatInputModule, Field],
  template: `
    @if (fieldRef(); as field) {
      <mat-form-field class="full-width">
        <mat-label>{{ label() }}</mat-label>
        <input matInput type="number" [field]="field" [errorStateMatcher]="errorMatcher" />
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
export class NumberInputComponent {
  private readonly formDataService = inject(FormDataService);

  label = input.required<string>();
  hint = input.required<string>();
  fieldName = input.required<string>();

  fieldRef = computed(() => {
    const name = this.fieldName();
    return name ? this.formDataService.getField<number>(name) : undefined;
  });

  // ErrorStateMatcher that reads from Signal Forms field state
  errorMatcher = new SignalFormErrorStateMatcher(() => this.fieldRef());
}

export const exposedNumberInput = exposeComponent(NumberInputComponent, {
  description:
    'A number input field. Validation comes from form-definition schema.',
  input: {
    label: s.string('The label displayed above the input'),
    hint: s.string('Helper text displayed below (empty string if none)'),
    fieldName: s.string(
      'The field name matching a field in the form-definition',
    ),
  },
});
