import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'ss-subreddit',
  templateUrl: './subreddit.component.html',
  styleUrls: ['./subreddit.component.css']
})
export class SubredditComponent implements OnInit {
  @Input() name: string = '';
  submissionDatas!: {[key: string]: any}[];

  constructor() { }

  ngOnInit(): void {
    this.submissionDatas = [];
  }

}
