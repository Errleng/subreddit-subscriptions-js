import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { HttpClientModule } from '@angular/common/http';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { SubredditComponent } from './subreddit/subreddit.component';
import { SubmissionComponent } from './submission/submission.component';
import { SubredditListComponent } from './subreddit-list/subreddit-list.component';

@NgModule({
  declarations: [
    AppComponent,
    SubredditComponent,
    SubmissionComponent,
    SubredditListComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FontAwesomeModule,
    FormsModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule { }
