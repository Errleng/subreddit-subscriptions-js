import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { Subscription } from 'rxjs';

@Component({
  selector: 'ss-subreddit-list',
  templateUrl: './subreddit-list.component.html',
  styleUrls: ['./subreddit-list.component.css'],
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

  static download(content: string, fileName: string, contentType: string): void {
    const anchor = document.createElement('a');
    const file = new Blob([content], { type: contentType });
    anchor.href = URL.createObjectURL(file);
    anchor.download = fileName;
    anchor.click();
  }

  addSub(subName: string) {
    this.http.get(`/api/valid/subreddit/${subName}`, { observe: 'response' }).subscribe(
      (resp) => {
        if (resp.ok) {
          this.subredditNames.push(subName);
          localStorage.setItem(this.savedSubNamesKey, JSON.stringify(this.subredditNames));
        } else {
          alert(`Could not find r/${subName}`);
        }
      },
    );
  }

  removeSub(subIndex: number): void {
    this.subredditNames.splice(subIndex, 1);
    localStorage.setItem(this.savedSubNamesKey, JSON.stringify(this.subredditNames));
  }

  importSubredditList(event: Event): void {
    const inputElement: HTMLInputElement = event.target as HTMLInputElement;
    if (inputElement.files === null) {
      console.error('Imported file is null');
      return;
    }

    const file: File = inputElement.files[0];
    const fileReader: FileReader = new FileReader();
    fileReader.onload = () => {
      if (fileReader.result) {
        this.subredditNames = JSON.parse(fileReader.result as string);
        localStorage.setItem(this.savedSubNamesKey, JSON.stringify(this.subredditNames));
      }
    };
    fileReader.readAsText(file);
  }

  exportSubredditList(): void {
    SubredditListComponent.download(JSON.stringify(this.subredditNames), 'subreddit-names.json', 'application/json');
  }
}
