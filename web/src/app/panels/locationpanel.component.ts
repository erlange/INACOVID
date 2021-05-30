import { Component, Input, OnInit, } from '@angular/core';
import { i18n } from './../data/data.model';
import { environment } from 'src/environments/environment';
import { NbDialogRef } from '@nebular/theme';

@Component({
  selector: 'app-about',
  template: `
  <!-- <ng-template #locationDialog  let-data let-ref="dialogRef">
  </ng-template> -->
  <div style="width:auto;" >
    <nb-card accent="primary">
      <nb-card-header size="small">
        <img src="{{urlLogo}}" width="36" height="36" />
        {{Title}}
      </nb-card-header>
      <nb-card-body>
        <div style="overflow:hidden scroll; height:75vh; margin-right: -10px;">
        <nb-radio-group  [(ngModel)]="SelectedLocation" (valueChange)="submit($event);" [value]="SelectedLocation">
        <!-- <nb-radio-group (valueChange)="close()"> -->
          <nb-radio
            *ngFor="let location of Locations"
            [value]="location"  >
            {{ location }}
          </nb-radio>
        </nb-radio-group>
        </div>
      </nb-card-body>
    </nb-card>
  </div>
`,
})
export class LocationPanelComponent implements OnInit {
  Title: string;
  urlLogo = window.location.origin + environment.baseHref + '/assets/img/logo-36.png';
  @Input() Locations: string[];
  @Input() SelectedLocation: string;
  @Input() Lang: string;

  constructor(private dialogRef: NbDialogRef<LocationPanelComponent>){}

  ngOnInit(): void {
    this.Title = i18n.LOC_OPT_TITLE[this.Lang];
  }

  close(): void {
    this.dialogRef.close(location);
  }
  submit(location: string): void {
    this.dialogRef.close(location);
  }
}
