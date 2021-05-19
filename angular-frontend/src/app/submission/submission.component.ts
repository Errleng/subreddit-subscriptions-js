import { FocusableOption, FocusOrigin } from '@angular/cdk/a11y';
import {
  Component, ElementRef, Input, OnInit, ViewChild,
} from '@angular/core';

@Component({
  selector: 'ss-submission',
  templateUrl: './submission.component.html',
  styleUrls: ['./submission.component.css'],
})
export class SubmissionComponent implements OnInit, FocusableOption {
  @Input() data!: { [key: string]: any; };

  @ViewChild('cardDiv') card!: ElementRef;

  shortlink: string = '';

  disabled?: boolean | undefined;

  ngOnInit(): void {
    this.shortlink = `https://redd.it/${this.data.id}`;
  }

  focus(origin?: FocusOrigin): void {
    this.card.nativeElement.focus({ preventScroll: true });
    this.card.nativeElement.scrollIntoView(true);
  }
}
