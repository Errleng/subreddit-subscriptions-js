import { HttpClient } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { Subscription } from 'rxjs';

@Component({
  selector: 'ss-subreddit-list',
  templateUrl: './subreddit-list.component.html',
  styleUrls: ['./subreddit-list.component.css']
})
export class SubredditListComponent implements OnInit {
  faTrash = faTrash;
  searchSubName: string = '';
  subredditNames: string[] = [];
  sub!: Subscription;

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.subredditNames = ['personalfinance', 'food', 'sushi', 'ramen'];
  }

  addSub(subName: string) {
    this.http.get(`/api/valid/subreddit/${subName}`, {observe: 'response'}).subscribe(
      resp => {
        if (resp.ok) {
          this.subredditNames.push(subName);
        } else {
          alert(`Could not find r/${subName}`)
        }
      }
    );
  }

  removeSub(subIndex: number): void {
    this.subredditNames.splice(subIndex, 1);
  }
}
