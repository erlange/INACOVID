import { Component, Input, OnInit, } from '@angular/core';
import { i18n } from './../data/data.model';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-about',
  template: `
  <div style="width:400px">
    <nb-card accent="primary">
      <nb-card-header size="small">
        <img src="{{urlLogo}}" width="36" height="36" />
        {{Title}}
      </nb-card-header>
      <nb-card-body>
        <div [innerHTML]="About |safeHtml"></div>
      </nb-card-body>
    </nb-card>
  </div>
`,
})
export class AboutPanelComponent implements OnInit {
  Title: string;
  About: string;
  urlLogo = window.location.origin + environment.baseHref + '/assets/img/logo-36.png';
  @Input() Lang: string;

  ngOnInit(): void {
    this.Title = i18n.TITLE[this.Lang];
    this.About = i18n.ABOUT_TEXT[this.Lang];
  }
}
