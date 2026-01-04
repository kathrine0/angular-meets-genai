import { Component, inject, input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { exposeComponent } from '@hashbrownai/angular';
import { s } from '@hashbrownai/core';
import { FormDataService } from '../form-data.service';

@Component({
  selector: 'app-submit-button',
  imports: [MatButtonModule],
  template: `
    <div class="submit-container">
      <button mat-flat-button (click)="onSubmit()">
        {{ buttonLabel() }}
      </button>
    </div>
  `,
})
export class SubmitButtonComponent {
  private readonly formDataService = inject(FormDataService);

  buttonLabel = input.required<string>();

  onSubmit() {
    const data = this.formDataService.submit();
    alert(`Form submitted! Data:\n${JSON.stringify(data, null, 2)}`);
  }
}

export const exposedSubmitButton = exposeComponent(SubmitButtonComponent, {
  description: 'A submit button for form submission. Place at the end of the form.',
  input: {
    buttonLabel: s.string('The button label text, e.g., "Book Now", "Submit", "Reserve"'),
  },
});
