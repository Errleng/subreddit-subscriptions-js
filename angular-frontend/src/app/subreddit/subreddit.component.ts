import { Component, Input, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http'

@Component({
  selector: 'ss-subreddit',
  templateUrl: './subreddit.component.html',
  styleUrls: ['./subreddit.component.css']
})
export class SubredditComponent implements OnInit {
  private _sortTime: string = 'day';

  @Input() name: string = '';
  submissionDatas: {[key: string]: any}[] = [];

  get sortTime(): string {
    return this._sortTime;
  }

  set sortTime(newSortTime: string) {
    this._sortTime = newSortTime;
    this.loadData();
  }

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    let url: string = `/api/subreddit/${this.name}/top/${this.sortTime}/2`;
    this.http.get(url).subscribe({
      next: data => this.submissionDatas = Object.values(data),
      error: err => console.error(`Error getting data for r/${this.name} submission: ${err}`),
    });
  }
}
