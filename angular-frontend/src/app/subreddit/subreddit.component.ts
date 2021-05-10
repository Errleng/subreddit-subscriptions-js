import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { Subscription } from 'rxjs';

@Component({
  selector: 'ss-subreddit',
  templateUrl: './subreddit.component.html',
  styleUrls: ['./subreddit.component.css']
})
export class SubredditComponent implements OnInit, OnDestroy {
  @Input() name: string = '';
  submissionDatas: {[key: string]: any}[] = [];
  sub!: Subscription;

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.sub = this.http.get(`/api/subreddit/${this.name}/top/day/2`).subscribe({
      next: data => this.submissionDatas = Object.values(data),
      error: err => console.error(`Error getting data for r/${this.name} submission: ${err}`),
    });
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
