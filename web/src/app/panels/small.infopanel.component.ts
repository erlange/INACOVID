import { Component, Input,  } from '@angular/core';
import {  CommonModule } from '@angular/common';

@Component({
  selector: 'app-info-panel-sm',
  styleUrls: [],
  template: `
    <div style="width:100%;position:relative">
      <span style="font-size:0.67rem">{{CaseTitle}}</span>
      <span style="float:right;font-size:0.67rem" *ngIf="DailyNum">
        <i [class]="setArrowClassName(DailyNum)"></i>
        {{DailyNum | number:'': this.Lang }}
      </span>
      <div style="position:relative;font-size:1.28rem" *ngIf="TotalNum">
        {{TotalNum | number:'': this.Lang }}
        <div style="float:right;" >
            <i [class]="IconClassName" style="opacity:0.1;font-size:2rem"></i>
        </div>
      </div>
    </div>
  `,
  styles: [],
})
export class SmallInfoPanelComponent {

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
