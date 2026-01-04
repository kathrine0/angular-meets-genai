import { Component, input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { exposeComponent } from '@hashbrownai/angular';
import { s } from '@hashbrownai/core';

@Component({
  selector: 'app-form-card',
  imports: [MatCardModule],
  template: `
    <mat-card class="form-card">
      <mat-card-header>
        <mat-card-title>{{ title() }}</mat-card-title>
        @if (description()) {
          <mat-card-subtitle>{{ description() }}</mat-card-subtitle>
        }
      </mat-card-header>
      <mat-card-content>
        <ng-content />
      </mat-card-content>
    </mat-card>
  `,
})
export class FormCardComponent {
  title = input.required<string>();
  description = input.required<string>();
}

export const exposedFormCard = exposeComponent(FormCardComponent, {
  description: 'A card container for grouping related form fields together with a title and optional description. Use this to group related form fields like personal information, booking details, or preferences.',
  input: {
    title: s.string('The title of the form section'),
    description: s.string('A description or instructions for this form section, use empty string if none'),
  },
  children: 'any',
});
