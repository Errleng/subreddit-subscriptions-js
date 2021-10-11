import { HttpEvent, HttpEventType, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { observable, Observable, ReplaySubject } from 'rxjs';
import { catchError, finalize, switchMap, tap } from 'rxjs/operators'

@Injectable({
  providedIn: 'root'
})
export class RateLimiterService implements HttpInterceptor {
  constructor() { }

  private queue: ReplaySubject<any>[] = [];

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (req.url.match(/\/api\/subreddit\/.*/)) {
      console.log(`intercepted request: ${req.url}`, this.queue);

      const requestQueueItem$ = new ReplaySubject<any>();
      const result$ = requestQueueItem$.pipe(
        switchMap(() => {
          return next.handle(req).pipe(
            tap(res => {
              console.log('requested', req.url, res, this.queue)
              if (res.type == HttpEventType.Response) {
                this.processNextRequest();
              }
            }),
            catchError(err => {
              console.error(err)
              this.processNextRequest();
              throw err;
            }),
            finalize(() => {
              const index = this.queue.findIndex(r => r === requestQueueItem$);
              if (index !== -1) {
                this.queue.splice(index, 1);
              }
              console.log('finished', req.url, index, this.queue)
            })
          )
        }),
        finalize(() => {
          const index = this.queue.findIndex(r => r === requestQueueItem$);
          if (index !== -1) {
            this.queue.splice(index, 1);
          }
          if (index == 0) {
            this.dispatchRequest();
          }
          console.log('deleted', req.url, index, this.queue)
        })
      );
      this.queue.push(requestQueueItem$);

      if (this.queue.length <= 1) {
        this.dispatchRequest();
      }

      return result$;
    } else {
      return next.handle(req);
    }
  }

  private processNextRequest(): void {
    if (this.queue && this.queue.length > 0) {
      this.queue.shift();
    }
    this.dispatchRequest();
  }

  private dispatchRequest(): void {
    console.log('dispatching next', this.queue)
    if (this.queue.length > 0) {
      const nextSub$ = this.queue[0];
      nextSub$.next();
      nextSub$.complete();
    }
  }
}