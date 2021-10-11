import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RedditService {
  constructor(private http: HttpClient) { }

  public checkSubredditValid(name: string): Observable<any> {
    return this.http.get(`/api/valid/subreddit/${name}`, { observe: 'response' });
  }

  public getSubmissions(name: string, sortTime: string): Observable<object> {
    return this.http.get(`/api/subreddit/${name}/top/${sortTime}/10`);
  }
}
