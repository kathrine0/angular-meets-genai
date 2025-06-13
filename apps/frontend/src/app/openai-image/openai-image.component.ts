import { HttpClient } from '@angular/common/http';
import { Component, inject, DestroyRef, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { take } from 'rxjs';
import { ChatComponent, Conversation } from '../components/chat.component';
import { MatFormField, MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

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
      <img
        [src]="'data:image/png;base64,' + imageUrl()"
        alt="Generated Image"
      />
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
      .post(`${apiUrl}`, { prompt })
      .pipe(takeUntilDestroyed(this.destroyRef), take(1))
      .subscribe((response: any) => {
        this.imageUrl.set(response.data[0].b64_json);
      });
  }
}
