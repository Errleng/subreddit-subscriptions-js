import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'ss-settings-dialog',
  templateUrl: './settings-dialog.component.html',
  styleUrls: ['./settings-dialog.component.css']
})
export class SettingsDialogComponent implements OnInit {
  public settingsForm!: FormGroup;

  constructor() { }

  ngOnInit(): void {
    this.settingsForm = new FormGroup({
      scrollSubredditUpKey: new FormControl(''),
      scrollSubredditDownKey: new FormControl(''),
      scrollSubmissionUpKey: new FormControl(''),
      scrollSubmissionDownKey: new FormControl(''),
      openSubmissionKey: new FormControl(''),
    })
  }

  onSave(): void {
    console.log('Saving settings', this.settingsForm.controls);
  }
}
