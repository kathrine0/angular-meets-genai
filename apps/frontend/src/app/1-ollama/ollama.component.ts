import {
  HttpClient,
  HttpDownloadProgressEvent,
  HttpEvent,
  HttpEventType,
  HttpResponse,
} from '@angular/common/http';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  signal,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MdViewerComponent } from '../components/md-viewer.component';
import { filter, map, tap } from 'rxjs/operators';
import ollama, { GenerateResponse } from 'ollama/browser';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

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
  prompt = 'Czym jest Generative AI? Odpowiedz krótko i zwięźle.';

  async getAnswer() {
    this.answer.set('Loading...');

    const response = await ollama.generate({
      model: 'SpeakLeash/bielik-11b-v3.0-instruct:Q4_K_M',
      prompt: this.prompt,
      stream: true,
    });

    this.answer.set('');

    for await (const chunk of response) {
      this.answer.update((prev) => prev + chunk.response);
    }
  }

  // private apiUrl = '/api/ollama';
  // private httpClient = inject(HttpClient);
  // private destroyRef = inject(DestroyRef);

  // getAnswer() {
  //   this.answer.set('Loading...');

  //   this.httpClient
  //     .post(
  //       this.apiUrl,
  //       { prompt: this.prompt },
  //       {
  //         responseType: 'text',
  //         observe: 'events',
  //         reportProgress: true,
  //       },
  //     )
  //     .pipe(
  //       filter(
  //         (event: HttpEvent<string>): boolean =>
  //           event.type === HttpEventType.DownloadProgress ||
  //           event.type === HttpEventType.Response,
  //       ),
  //       tap(() => this.answer.set('')),
  //       map((event: HttpEvent<string>) => {
  //         if (event.type === HttpEventType.DownloadProgress) {
  //           return {
  //             response: (event as HttpDownloadProgressEvent).partialText ?? '',
  //             generating: true,
  //           };
  //         } else {
  //           return {
  //             response: (event as HttpResponse<string>).body ?? '',
  //             generating: false,
  //           };
  //         }
  //       }),
  //       takeUntilDestroyed(this.destroyRef),
  //     )
  //     .subscribe(({ response, generating }) => {
  //       if (generating) {
  //         this.answer.set(response);
  //       }
  //     });
  // }
}
