import { HttpClient } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { take } from 'rxjs';
import { MdViewerComponent } from '../components/md-viewer.component';

@Component({
  selector: 'app-ollama',
  standalone: true,
  template: `
    <button mat-flat-button (click)="getAnswer()">Get Answer</button>
    <br />
    <br />
    @if (answer()) {
    <app-md-viewer [md]="answer()" />
    }
  `,
  imports: [MatButtonModule, MdViewerComponent],
})
export class OllamaComponent {
  private apiUrl: string = 'http://localhost:3000/ollama';
  private httpClient = inject(HttpClient);

  answer = signal('');

  getAnswer() {
    this.answer.set('Loading...');

    this.httpClient
      .get<any>(this.apiUrl)
      .pipe(take(1))
      .subscribe(({response}) => {
        this.answer.set(response);
      });
  }
}
