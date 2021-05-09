import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'ss-subreddit-list',
  templateUrl: './subreddit-list.component.html',
  styleUrls: ['./subreddit-list.component.css']
})
export class SubredditListComponent implements OnInit {
  subredditNames: string[] = [];

  constructor() { }

  ngOnInit(): void {

  }

}
