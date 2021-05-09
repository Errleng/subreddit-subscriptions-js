import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'ss-submission',
  templateUrl: './submission.component.html',
  styleUrls: ['./submission.component.css']
})
export class SubmissionComponent implements OnInit {
  @Input() data!: {[key:string]: any};

  constructor() { }

  ngOnInit(): void {
  }

}
