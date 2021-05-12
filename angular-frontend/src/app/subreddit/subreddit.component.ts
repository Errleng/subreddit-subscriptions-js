import { Component, Input, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'ss-subreddit',
  templateUrl: './subreddit.component.html',
  styleUrls: ['./subreddit.component.css'],
})
export class SubredditComponent implements OnInit {
  @Input() name: string = '';

  submissionDatas: { [key: string]: any }[] = [];

  private sortTimeInternal: string = 'day';

  get sortTime(): string {
    return this.sortTimeInternal;
  }

  set sortTime(newSortTime: string) {
    this.sortTimeInternal = newSortTime;
    this.loadData();
  }

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    const url: string = `/api/subreddit/${this.name}/top/${this.sortTime}/2`;
    this.http.get(url).subscribe({
      next: (data) => { this.submissionDatas = Object.values(data); },
      error: (err) => console.error(`Error getting data for r/${this.name} submission: ${err}`),
    });
  }
}
