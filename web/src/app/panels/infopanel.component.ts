import { Component, Input,  } from '@angular/core';

@Component({
  selector: 'app-info-panel',
  styleUrls: ['infopanel.component.scss'],
  template: `
  <nb-card [accent]="Accent ">
    <nb-card-body>
      {{CaseTitle}}
      <span style="float:right">
        <i *ngIf="DailyNum" [class]="setArrowClassName(DailyNum)"></i>
        {{DailyNum | number:'': this.Lang }}
      </span>
      <div style="position:relative">
        <h3>
        {{TotalNum | number:'': this.Lang }}
        <div style="float:right;" >
            <i [class]="IconClassName" style="opacity:0.1;font-size:2rem"></i>
        </div>
        </h3>
      </div>
    </nb-card-body>
  </nb-card>
  `,
  styles: [],
})
export class InfoPanelComponent {

  @Input() DailyNum: number;
  @Input() TotalNum: number;
  @Input() CaseTitle: string;
  @Input() Lang: string;
  @Input() Accent: string;
  @Input() IconClassName: string;
  ArrowClassName: string;

  constructor(){}

  setArrowClassName(num: number): string{
    let className = '';
    className = num > 0 ? 'fas fa-arrow-up' : num < 0 ? 'fas fa-arrow-down' : '' ;
    return className;
  }
}
