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
  savedSubNamesKey: string = 'subredditNames';

  faTrash = faTrash;
  searchSubName: string = '';
  subredditNames: string[] = [];
  sub!: Subscription;

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    const savedSubNames = localStorage.getItem(this.savedSubNamesKey);
    if (savedSubNames === null) {
      this.subredditNames = ['personalfinance', 'food', 'sushi', 'ramen'];
    } else {
      this.subredditNames = JSON.parse(savedSubNames);
    }
  }

  addSub(subName: string) {
    this.http.get(`/api/valid/subreddit/${subName}`, {observe: 'response'}).subscribe(
      resp => {
        if (resp.ok) {
          this.subredditNames.push(subName);
          localStorage.setItem(this.savedSubNamesKey, JSON.stringify(this.subredditNames));
        } else {
          alert(`Could not find r/${subName}`)
        }
      }
    );
  }

  removeSub(subIndex: number): void {
    this.subredditNames.splice(subIndex, 1);
    localStorage.setItem(this.savedSubNamesKey, JSON.stringify(this.subredditNames));
  }
}
