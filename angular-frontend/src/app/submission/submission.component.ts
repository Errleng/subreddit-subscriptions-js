import { FocusableOption, FocusOrigin } from '@angular/cdk/a11y';
import {
  Component, ElementRef, Input, OnInit, SecurityContext, ViewChild, ViewEncapsulation,
} from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'ss-submission',
  templateUrl: './submission.component.html',
  styleUrls: ['./submission.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class SubmissionComponent implements OnInit, FocusableOption {
  @Input() data!: { [key: string]: any; };

  @ViewChild('cardDiv') card!: ElementRef;

  @ViewChild('videoElem') videoElem!: ElementRef;

  @ViewChild('audioElem') audioElem!: ElementRef;

  shortlink: string = '';

  disabled?: boolean | undefined;

  constructor(private sanitizer: DomSanitizer) { }

  ngOnInit(): void {
    this.shortlink = `https://redd.it/${this.data.id}`;
    const { video } = this.data;
    if (video && video.includes('v.redd.it')) {
      this.data.video_audio = `${video.substring(0, video.lastIndexOf('/'))}/DASH_audio.mp4`;
    }
    if (this.data.html) {
      this.data.html = this.sanitizer.bypassSecurityTrustHtml(this.data.html);
    }
  }

  focus(origin?: FocusOrigin): void {
    this.card.nativeElement.focus({ preventScroll: true });
    this.card.nativeElement.scrollIntoView(true, { behavior: 'smooth' });
  }

  onMediaPlay() {
    if (this.audioElem) {
      this.audioElem.nativeElement.currentTime = this.videoElem.nativeElement.currentTime;
      this.audioElem.nativeElement.play();
    }
  }

  onMediaPlaying() {
    if (this.audioElem) {
      this.audioElem.nativeElement.currentTime = this.videoElem.nativeElement.currentTime
    }
  }

  onMediaPause() {
    if (this.audioElem) {
      this.audioElem.nativeElement.currentTime = this.videoElem.nativeElement.currentTime;
      this.audioElem.nativeElement.pause();
    }
  }

  onMediaSeekCompletion(event: any) {
    if (this.audioElem) {
      this.audioElem.nativeElement.currentTime = event.target.currentTime;
    }
  }
}
