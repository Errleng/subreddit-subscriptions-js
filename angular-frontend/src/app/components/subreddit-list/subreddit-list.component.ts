import { FocusKeyManager } from '@angular/cdk/a11y';
import {
  AfterViewInit, Component, OnInit, QueryList, ViewChildren
} from '@angular/core';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { Subscription } from 'rxjs';
import { RedditService } from 'src/app/services/reddit/reddit.service';
import { SettingsService } from 'src/app/services/settings/settings.service';
import { SubredditComponent } from '../subreddit/subreddit.component';

@Component({
  selector: 'ss-subreddit-list',
  templateUrl: './subreddit-list.component.html',
  styleUrls: ['./subreddit-list.component.css'],
})
export class SubredditListComponent implements OnInit, AfterViewInit {
  private keyEventManager!: FocusKeyManager<SubredditComponent>;

  @ViewChildren(SubredditComponent) subreddits!: QueryList<SubredditComponent>;

  faTrash = faTrash;

  searchSubName: string = '';

  subredditNames: string[] = [];

  sub!: Subscription;

  constructor(private redditService: RedditService, private settings: SettingsService) { }

  ngOnInit(): void {
    const savedSubNames = this.settings.getSubredditList();
    if (savedSubNames === null) {
      this.subredditNames = ['personalfinance', 'food']; // placeholder
    } else {
      this.subredditNames = JSON.parse(savedSubNames);
    }
  }

  ngAfterViewInit(): void {
    this.keyEventManager = new FocusKeyManager(this.subreddits);
  }

  onKeyDown(event: KeyboardEvent) {
    const { key } = event;
    switch (key) {
      case 'E':
        this.keyEventManager.setNextItemActive();
        break;
      case 'O':
        this.keyEventManager.setPreviousItemActive();
        break;
      default:
        break;
    }
  }

  addSub(subName: string) {
    this.redditService.checkSubredditValid(subName).subscribe(
      (resp: Response) => {
        if (resp.ok) {
          this.subredditNames.push(subName);
          this.settings.updateSubredditList(this.subredditNames);
        } else {
          alert(`Could not find r/${subName}`);
        }
      },
    );
  }

  removeSub(subIndex: number): void {
    this.subredditNames.splice(subIndex, 1);
    this.settings.updateSubredditList(this.subredditNames);
  }

  clearAllSubs(): void {
    this.subredditNames = [];
    this.settings.updateSubredditList(this.subredditNames);
  }

  importSubredditList(event: Event): void {
    const inputElement: HTMLInputElement = event.target as HTMLInputElement;
    if (inputElement.files === null) {
      console.error('Imported file is null', event);
      return;
    }

    const file: File = inputElement.files[0];
    this.settings.importSubredditList(file).then((names) => {
      this.subredditNames = names;
      this.settings.updateSubredditList(this.subredditNames);
    })
  }

  exportSubredditList(): void {
    this.settings.exportSubredditList(this.subredditNames);
  }
}
