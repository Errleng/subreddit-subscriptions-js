import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { Subscription } from 'rxjs';

@Component({
  selector: 'ss-subreddit',
  templateUrl: './subreddit.component.html',
  styleUrls: ['./subreddit.component.css']
})
export class SubredditComponent implements OnInit {
  @Input() name: string = '';
  submissionDatas: {[key: string]: any}[] = [];
  sortTime: string = 'day';

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    const url: string = `/api/subreddit/${this.name}/top/${this.sortTime}/2`;
    this.http.get(url).subscribe({
      next: data => this.submissionDatas = Object.values(data),
      error: err => console.error(`Error getting data for r/${this.name} submission: ${err}`),
    });
  }

  onChangeSortTime(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    this.sortTime = inputElement.value;
    this.loadData();
  }
}
