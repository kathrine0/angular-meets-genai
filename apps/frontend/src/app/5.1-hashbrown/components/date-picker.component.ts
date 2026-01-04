import { Component, computed, inject, input } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { Field } from '@angular/forms/signals';
import { exposeComponent } from '@hashbrownai/angular';
import { s } from '@hashbrownai/core';
import { FormDataService } from '../form-data.service';
import { SignalFormErrorStateMatcher } from '../signal-form-error-state-matcher';

@Component({
  selector: 'app-date-picker',
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    Field,
  ],
  template: `
    @if (fieldRef(); as field) {
      <mat-form-field class="full-width">
        <mat-label>{{ label() }}</mat-label>
        <input matInput [matDatepicker]="picker" [field]="field" [errorStateMatcher]="errorMatcher" />
        <mat-datepicker-toggle matIconSuffix [for]="picker" />
        <mat-datepicker #picker />
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
export class DatePickerComponent {
  private readonly formDataService = inject(FormDataService);

  label = input.required<string>();
  hint = input.required<string>();
  fieldName = input.required<string>();

  fieldRef = computed(() => {
    const name = this.fieldName();
    return name ? this.formDataService.getField<string>(name) : undefined;
  });

  errorMatcher = new SignalFormErrorStateMatcher(() => this.fieldRef());
}

export const exposedDatePicker = exposeComponent(DatePickerComponent, {
  description:
    'A date picker field. The value comes from the form-definition schema.',
  input: {
    label: s.string('The label displayed above the date picker'),
    hint: s.string('Helper text displayed below (empty string if none)'),
    fieldName: s.string(
      'The field name matching a field in the form-definition',
    ),
  },
});
