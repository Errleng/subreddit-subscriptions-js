import { FocusableOption, FocusKeyManager, FocusOrigin } from '@angular/cdk/a11y';
import { HttpClient } from '@angular/common/http';
import {
  AfterViewInit, Component, ElementRef, Input, OnInit, QueryList, ViewChild, ViewChildren,
} from '@angular/core';
import { SubmissionComponent } from '../submission/submission.component';

@Component({
  selector: 'ss-subreddit',
  templateUrl: './subreddit.component.html',
  styleUrls: ['./subreddit.component.css'],
})
export class SubredditComponent implements OnInit, AfterViewInit, FocusableOption {
  private _sortTime: string = 'day';

  private keyEventManager!: FocusKeyManager<SubmissionComponent>;

  @Input() name: string = '';

  @ViewChild('subredditTitle') subredditTitle!: ElementRef;

  @ViewChildren(SubmissionComponent) submissions!: QueryList<SubmissionComponent>;

  submissionDatas: { [key: string]: any; }[] = [];

  disabled?: boolean | undefined;

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

  ngAfterViewInit(): void {
    this.keyEventManager = new FocusKeyManager(this.submissions);
  }

  focus(origin?: FocusOrigin): void {
    this.subredditTitle.nativeElement.focus();
  }

  onKeyDown(event: KeyboardEvent) {
    console.log(event);
    const { key } = event;
    switch (key) {
      case 's':
        this.keyEventManager.setNextItemActive();
        break;
      case 'f':
        this.keyEventManager.setPreviousItemActive();
        break;
      default:
        break;
    }
  }

  loadData(): void {
    const url: string = `/api/subreddit/${this.name}/top/${this.sortTime}/10`;
    this.http.get(url).subscribe({
      next: (data) => { this.submissionDatas = Object.values(data); },
      error: (err) => console.error(`Error getting data for r/${this.name} submission: ${err}`),
    });
  }
}
