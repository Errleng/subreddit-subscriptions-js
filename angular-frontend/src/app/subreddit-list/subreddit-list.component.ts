import { HttpClient } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { Subscription } from 'rxjs';

@Component({
  selector: 'ss-subreddit-list',
  templateUrl: './subreddit-list.component.html',
  styleUrls: ['./subreddit-list.component.css']
})
export class SubredditListComponent implements OnInit, OnDestroy {
  faTrash = faTrash;
  searchSubName: string = '';
  subredditNames: string[] = [];
  sub!: Subscription;

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.subredditNames = ['personalfinance', 'food', 'sushi'];
  }

  onSubmit() {
    this.sub = this.http.get(`/api/valid/subreddit/${this.searchSubName}`, {observe: 'response'}).subscribe(
      resp => {
        if (resp.ok) {
          this.subredditNames.push(this.searchSubName);
        } else {
          alert(`Could not find r/${this.searchSubName}`)
        }
      }
    );
  }

  removeSub(subIndex: number): void {
    this.subredditNames.splice(subIndex, 1);
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
