import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {
  private readonly subredditListFile: string = 'subreddit-names.json';
  private readonly savedSubNamesKey: string = 'subredditNames';

  constructor() { }

  download(content: string, fileName: string, contentType: string): void {
    const anchor = document.createElement('a');
    const file = new Blob([content], { type: contentType });
    anchor.href = URL.createObjectURL(file);
    anchor.download = fileName;
    anchor.click();
  }

  getSubredditList(): string | null {
    return localStorage.getItem(this.savedSubNamesKey);
  }

  updateSubredditList(subredditNames: string[]): void {
    localStorage.setItem(this.savedSubNamesKey, JSON.stringify(subredditNames));
  }

  async importSubredditList(file: File): Promise<string[]> {
    return new Promise<string[]>((resolve) => {
      const fileReader: FileReader = new FileReader();
      fileReader.onload = () => {
        if (fileReader.result) {
          const subredditNames = JSON.parse(fileReader.result as string);
          resolve(subredditNames);
        }
      };
      fileReader.readAsText(file);
    });
  }

  exportSubredditList(subredditNames: string[]): void {
    this.download(JSON.stringify(subredditNames), this.subredditListFile, 'application/json');
  }
}
