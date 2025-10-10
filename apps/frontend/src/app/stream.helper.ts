import {
  HttpClient,
  HttpDownloadProgressEvent,
  HttpEvent,
  HttpEventType,
  HttpResponse,
} from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class StreamHelper {
  private readonly httpClient = inject(HttpClient);

  stream(
    url: string,
    body: unknown
  ): Observable<{ response: string; generating: boolean }> {
    return this.httpClient
      .post(url, body, {
        responseType: 'text',
        observe: 'events',
        reportProgress: true,
      })
      .pipe(
        filter(
          (event: HttpEvent<string>): boolean =>
            event.type === HttpEventType.DownloadProgress ||
            event.type === HttpEventType.Response
        ),
        map((event: HttpEvent<string>) => {
          const generating = event.type === HttpEventType.DownloadProgress;
          const response =
            event.type === HttpEventType.DownloadProgress
              ? (event as HttpDownloadProgressEvent).partialText ?? ''
              : (event as HttpResponse<string>).body ?? '';

          return {
            response,
            generating,
          };
        })
      );
  }
}
