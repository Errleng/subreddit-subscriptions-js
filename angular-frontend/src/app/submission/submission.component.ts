import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'ss-submission',
  templateUrl: './submission.component.html',
  styleUrls: ['./submission.component.css']
})
export class SubmissionComponent implements OnInit {
  @Input() data!: {[key:string]: any};
  shortlink: string = '';

  constructor() { }

  ngOnInit(): void {
    this.shortlink = `https://redd.it/${this.data.id}`;
  }

}
