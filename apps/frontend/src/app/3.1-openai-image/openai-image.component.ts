import { HttpClient } from '@angular/common/http';
import { Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { take } from 'rxjs';
import OpenAI from 'openai';

const apiUrl = '/api/openai/image';

@Component({
  selector: 'app-openai',
  template: `
    <form>
      <mat-form-field>
        <mat-label>Enter image prompt</mat-label>
        <input matInput type="text" #input name="prompt" />
      </mat-form-field>
      <br />
      <button mat-flat-button (click)="generateImage($event, input.value)">
        Get Answer
      </button>
    </form>
    <br />
    @if (imageUrl()) {
    <img [src]="'data:image/png;base64,' + imageUrl()" alt="Generated Image" />
    }
  `,
  styles: [
    `
      form {
        display: flex;
        gap: 1rem;
        align-items: center;
      }

      mat-form-field {
        flex: 1;
      }
    `,
  ],
  imports: [MatFormFieldModule, MatInputModule, MatButtonModule],
})
export class OpenaiImageComponent {
  private httpClient = inject(HttpClient);
  private destroyRef = inject(DestroyRef);

  imageUrl = signal<string>('');

  generateImage(event: Event, prompt: string): void {
    event.preventDefault();

    if (prompt.trim() === '') {
      return;
    }

    this.httpClient
      .post<OpenAI.Images.ImagesResponse>(`${apiUrl}`, { prompt })
      .pipe(takeUntilDestroyed(this.destroyRef), take(1))
      .subscribe((response) => {
        if (response.data?.[0].b64_json) {
          this.imageUrl.set(response.data[0].b64_json);
        } else {
          console.error('No image data received from OpenAI API');
        }
      });
  }
}
