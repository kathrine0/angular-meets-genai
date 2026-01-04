import { Component, computed, inject, input } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { Field } from '@angular/forms/signals';
import { exposeComponent } from '@hashbrownai/angular';
import { s } from '@hashbrownai/core';
import { FormDataService } from '../form-data.service';
import { SignalFormErrorStateMatcher } from '../signal-form-error-state-matcher';

@Component({
  selector: 'app-select-field',
  imports: [MatFormFieldModule, MatSelectModule, Field],
  template: `
    @if (fieldRef(); as field) {
      <mat-form-field class="full-width">
        <mat-label>{{ label() }}</mat-label>
        <mat-select [field]="field" [errorStateMatcher]="errorMatcher">
          @for (option of options(); track option.value) {
            <mat-option [value]="option.value">{{ option.label }}</mat-option>
          }
        </mat-select>
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
export class SelectFieldComponent {
  private readonly formDataService = inject(FormDataService);

  label = input.required<string>();
  options = input.required<{ value: string; label: string }[]>();
  hint = input.required<string>();
  fieldName = input.required<string>();

  fieldRef = computed(() => {
    const name = this.fieldName();
    return name ? this.formDataService.getField<string>(name) : undefined;
  });

  errorMatcher = new SignalFormErrorStateMatcher(() => this.fieldRef());
}

export const exposedSelectField = exposeComponent(SelectFieldComponent, {
  description:
    'A dropdown select field. The value comes from the form-definition schema.',
  input: {
    label: s.string('The label displayed above the select'),
    options: s.array(
      'The dropdown options',
      s.object('A single option', {
        value: s.string('The option value'),
        label: s.string('The option label'),
      }),
    ),
    hint: s.string('Helper text displayed below (empty string if none)'),
    fieldName: s.string(
      'The field name matching a field in the form-definition',
    ),
  },
});
