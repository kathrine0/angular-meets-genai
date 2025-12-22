import { HttpClient } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MdViewerComponent } from '../components/md-viewer.component';
import { from, take } from 'rxjs';
import ollama, { GenerateResponse } from 'ollama/browser';

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
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OllamaComponent {
  answer = signal('');

  // getAnswer() {
  //   console.error('not implemented yet.');
  // }








  // async getAnswer() {
  //   const prompt = 'What is generative AI? Keep the answer short and concise.';
  //   this.answer.set('Loading...');

  //   const response = await ollama.generate({
  //     model: 'llama3.2',
  //     prompt: prompt,
  //   });

  //   this.answer.set(response.response);
  // }









  private apiUrl = '/api/ollama';
  private httpClient = inject(HttpClient);
  getAnswer() {
    this.answer.set('Loading...');

    this.httpClient
      .get<GenerateResponse>(this.apiUrl)
      .pipe(take(1))
      .subscribe(({ response }) => {
        this.answer.set(response);
      });
  }
}
