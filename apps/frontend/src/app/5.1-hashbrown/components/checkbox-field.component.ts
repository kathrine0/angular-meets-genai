import { Component, computed, inject, input } from '@angular/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { Field } from '@angular/forms/signals';
import { exposeComponent } from '@hashbrownai/angular';
import { s } from '@hashbrownai/core';
import { FormDataService } from '../form-data.service';

@Component({
  selector: 'app-checkbox-field',
  imports: [MatCheckboxModule, Field],
  template: `
    @if (fieldRef()) {
      <mat-checkbox [field]="fieldRef()!">
        {{ label() }}
      </mat-checkbox>
    }
    @if (hint()) {
      <div class="hint">{{ hint() }}</div>
    }
  `,
})
export class CheckboxFieldComponent {
  private readonly formDataService = inject(FormDataService);

  label = input.required<string>();
  hint = input.required<string>();
  fieldName = input.required<string>();

  fieldRef = computed(() => {
    const name = this.fieldName();
    return name ? this.formDataService.getField<boolean>(name) : undefined;
  });
}

export const exposedCheckboxField = exposeComponent(CheckboxFieldComponent, {
  description: 'A checkbox field. The value comes from the form-definition schema.',
  input: {
    label: s.string('The label displayed next to the checkbox'),
    hint: s.string('Helper text displayed below (empty string if none)'),
    fieldName: s.string('The field name matching a field in the form-definition'),
  },
});
