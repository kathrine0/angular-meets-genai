import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { OpenAI } from 'openai';
import { Observable, switchMap } from 'rxjs';

const apiUrl = '/api/code-gen';

@Injectable({
  providedIn: 'root',
})
export class OSModelStreamService {
  private readonly http = inject(HttpClient);

  askQuestion(messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[]) {
    return this.http
      .post<{ streamId: string }>(
        `${apiUrl}/create-stream`,
        messages
      )
      .pipe(switchMap(({ streamId }) => this.startStream(streamId)));
  }

  private startStream(streamId: string) {
    return new Observable<string>((subscriber) => {
      const eventSource = new EventSource(
        `${apiUrl}/stream/${streamId}`
      );

      eventSource.onmessage = (event) => {
        if (event.data === '[DONE]') {
          eventSource.close();
          subscriber.complete();
          return;
        }

        subscriber.next(event.data);
      };

      eventSource.onerror = (error) => {
        console.error('EventSource error: ' + error);
        eventSource.close();
        subscriber.complete();
      };
    });
  }
}
