import { Component, Input, OnChanges, OnDestroy, EventEmitter, Output} from '@angular/core';
import {IData, i18n, IChartType, GetChartTypes} from './../data/data.model';
import { NbThemeService } from '@nebular/theme';
import * as Utils from './../data/data.utils';
import { formatDate, formatNumber } from '@angular/common';
import { Subscription } from 'rxjs';

interface IChartTypeOptionSerie{
  name: string;
  type: string;
  data: number[];
}

interface IChartTypeOptions{
  legendData: string[];
  series: IChartTypeOptionSerie[];
}


@Component({
  selector: 'app-chart-case',
  styleUrls: ['chart.case.component.scss'],
  template: `
  <nb-card [accent]="Accent">
    <nb-card-header>
      <!-- <div align="center">
        <button nbButton *ngIf="SelectedData" (click)="onHeaderClick()" shape="semi-round"  size="small" status="primary">{{ Title }}</button>
      </div> -->
      <span *ngIf="SelectedData" (click)="onHeaderClick()" class="pointer"><i class="fas fa-bars"></i> {{Title}}</span>
      <ng-content></ng-content>
    </nb-card-header>

    <nb-card-body *ngIf="isDataReady;else loading">
      <div class="d-flex justify-content-center">
        <select class="form-control form-control-sm" style="width: 200px" aria-label=".form-select-sm example" [value]="this.SelectedChartType" (change)="this.onChartTypeChange($event.target.value)">
          <option *ngFor="let i = index; let chartType of this.ChartTypes" [value]="chartType.Value" [selected]="chartType.Value === this.SelectedChartType" >{{chartType.DisplayText}}</option>
        </select>
        <!-- <nb-select formControlName="mySelected"  #select [placeholder]="Placeholder" size="tiny" (selectedChange)="this.onChartTypeChange($event)"  [(selected)]="SelectedChartType" appearance="hero">
          <nb-option *ngFor="let i = index; let chartType of this.ChartTypes" [value]="chartType.Value"  >{{chartType.DisplayText}}</nb-option>
        </nb-select> -->

      </div>
    <!-- <nb-select placeholder="{{this.SelectedChartType}}" size="small" (selectedChange)="this.onChartTypeChange($event)" [(selected)]="this.SelectedChartType" >
      <nb-option *ngFor="let i = index; let chartType of this.ChartTypes" [value]="chartType.Value" >{{chartType.DisplayText}}</nb-option>
    </nb-select> -->
      <div echarts [options]="options" [initOpts]="this.initOpts" class="echart" style="height: 328px;overflow:hidden"></div>
    </nb-card-body>
  </nb-card>
  <ng-template #loading>
    <app-loading></app-loading>
  </ng-template>

  `,
  styles: [],
})
export class ChartCaseComponent implements OnChanges, OnDestroy {
  options: any;
  ChartTypeOptions: IChartTypeOptions;
  Title: string;
  axisLabelColor: string;
  SelectedChartType = 'CONFIRMED';
  themeSubscription: Subscription;
  ChartTypes: IChartType[];
  isDataReady = false;

  @Input() Accent: string;
  @Input() SelectedData: IData;
  @Input() Lang: string;

  @Output() HeaderClick: EventEmitter<string> = new EventEmitter();

  initOpts = {
    locale: 'en'
  };

  constructor(private themeSvc: NbThemeService){}

  setOptions(): void{
    this.themeSubscription = this.themeSvc.getJsTheme().subscribe(config => {

      const echarts: any = config.variables.echarts;
      const dt: IData = this.SelectedData;
      this.initOpts.locale = this.Lang;
      this.options = {
        animation: false,
        animationDuration: (idx: number) => {
          return idx * 100;
        },
        title: {
            // text: i18n.DAILY_CASES[this.Lang],
            // left: 'center',
        },
        tooltip: {
            trigger: 'axis',
            backgroundColor: '#3c3c3c',
            shadowOffsetX: 6,
            shadowOffsetY: 6,
            axisPointer: {
              type: 'cross',
              animation: false,
              label: {
                  backgroundColor: '#ccc',
                  borderColor: '#aaa',
                  borderWidth: 1,
                  shadowBlur: 0,
                  shadowOffsetX: 0,
                  shadowOffsetY: 0,
                  color: '#222'
              }
            },
            textStyle: {
              color: '#ddd'
            }
        },
        legend: {
          data: this.setChartTypeOptions(this.SelectedChartType, this.Lang).legendData,
          borderWidth: 1,
          textStyle: {
            color: echarts.textColor,
          },
          top: 16,
        },
        grid: {
          top: 64,
          left: '3%',
          right: '4%',
          bottom: '15%',
          containLabel: true
        },
        toolbox: {
          feature: {
              saveAsImage: { title: 'Save As PNG', show: true },
            }
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          axisLabel: {
            textStyle: {
              color: echarts.textColor,
            },
          },
        data: this.SelectedData.Confirmed.map(k => formatDate (Date.parse(k.CaseDate), i18n.DATE_FORMAT_MEDIUM[this.Lang], this.Lang )),
            color: echarts.textColor,
        },
        yAxis: {
          type: 'value',
          axisLabel: {
            formatter: (value: number) => {
              return formatNumber(value, this.Lang);
            },
            textStyle: {
              color: echarts.textColor,
            },
            }
        },
        dataZoom: [{
            id: 'dataZoomX',
            type: 'inside',
            filterMode: 'filter',
            start: 50,
            end: 100
          }, {
            // id: 'dataZoomY',
            // filterMode: 'none',
            // start: 0,
            // end: 10
        }],
        series: this.setChartTypeOptions(this.SelectedChartType, this.Lang).series,
      };
    });
  }

  ngOnChanges(): void {
    if (this.SelectedData !== undefined){
      this.setOptions();
      this.ChartTypes = GetChartTypes(this.Lang);
      this.Title = i18n.DAILY_CASES[this.Lang] + ' - ' + this.SelectedData.Location;
      this.Title = this.Title.toUpperCase();
      this.isDataReady = true;
    }
  }

  onChartTypeChange(selectedValue: string): void{
    this.SelectedChartType = selectedValue;
    this.setOptions();
  }

  setChartTypeOptions(type: string, lang: string): IChartTypeOptions {
    const dt: IData = this.SelectedData;
    const opts: IChartTypeOptions = { legendData: [], series: [] };
    if (type === 'CONFIRMED') {
      opts.legendData = [i18n.CONFIRMED[lang], i18n.MOVING_AVERAGE_7[lang]];
      opts.series = [{
          name: i18n.CONFIRMED[lang],
          type: 'bar',
          data: dt.Confirmed.map(k => k.CaseCount)
        },
        {
          name: i18n.MOVING_AVERAGE_7[lang],
          type: 'line',
          data: Utils.movingAvg(dt.Confirmed.map(k => k.CaseCount), 7, 0).map(n => Math.round(n))
        }, ];
    }
    if (type === 'DEATHS') {
      opts.legendData = [i18n.DEATHS[lang], i18n.MOVING_AVERAGE_7[lang]];
      opts.series = [{
          name: i18n.DEATHS[lang],
          type: 'bar',
          data: dt.Dead.map(k => k.CaseCount)
        },
        {
          name: i18n.MOVING_AVERAGE_7[lang],
          type: 'line',
          data: Utils.movingAvg(dt.Dead.map(k => k.CaseCount), 7, 0).map(n => Math.round(n))
        }, ];
    }
    if (type === 'RECOVERED') {
      opts.legendData = [i18n.RECOVERED[lang], i18n.MOVING_AVERAGE_7[lang]];
      opts.series = [{
          name: i18n.RECOVERED[lang],
          type: 'bar',
          data: dt.Cured.map(k => k.CaseCount)
        },
        {
          name: i18n.MOVING_AVERAGE_7[lang],
          type: 'line',
          data: Utils.movingAvg(dt.Cured.map(k => k.CaseCount), 7, 0).map(n => Math.round(n))
        }, ];
    }
    if (type === 'ACTIVE') {
      opts.legendData = [i18n.ACTIVE[lang], i18n.MOVING_AVERAGE_7[lang]];
      opts.series = [{
          name: i18n.ACTIVE[lang],
          type: 'bar',
          data: dt.Confirmed.map(k =>
            k.CaseCount - dt.Cured.find(j => j.CaseDate === k.CaseDate).CaseCount - dt.Dead.find(j => j.CaseDate === k.CaseDate).CaseCount )
        },
        {
          name: i18n.MOVING_AVERAGE_7[lang],
          type: 'line',
          data: Utils.movingAvg(dt.Confirmed.map(
            k => k.CaseCount - dt.Cured.find(
              j => j.CaseDate === k.CaseDate).CaseCount - dt.Dead.find(
                j => j.CaseDate === k.CaseDate).CaseCount ),
            7, 0).map(n => Math.round(n))
        }, ];
    }
    if (type === 'ALL_CASES') {
      opts.legendData = [i18n.DEATHS[lang], i18n.RECOVERED[lang], i18n.CONFIRMED[lang]];
      opts.series = [{
          name: i18n.DEATHS[lang],
          type: 'line',
          data: dt.Dead.map(k => k.CaseCount)
        },
        {
          name: i18n.RECOVERED[lang],
          type: 'line',
          data: dt.Cured.map(k => k.CaseCount)
        },
        {
          name: i18n.CONFIRMED[lang],
          type: 'line',
          data: dt.Confirmed.map(k => k.CaseCount)
        },
      ];
    }

    if (type === 'FATALITY_RECOVERY_RATE') {
      opts.legendData = [i18n.FATALITY_RATE[lang], i18n.RECOVERY_RATE[lang]];
      opts.series = [{
          name: i18n.FATALITY_RATE[lang],
          type: 'line',
          data: dt.DeadCum.map(k => k.CaseCount / ((dt.ConfirmedCum.find(j => j.CaseDate === k.CaseDate).CaseCount) === 0 ?
            0 : dt.ConfirmedCum.find(j => j.CaseDate === k.CaseDate).CaseCount) )
        },
        {
          name: i18n.RECOVERY_RATE[lang],
          type: 'line',
          data: dt.CuredCum.map(k => k.CaseCount / ((dt.ConfirmedCum.find(j => j.CaseDate === k.CaseDate).CaseCount) === 0 ?
          0 : dt.ConfirmedCum.find(j => j.CaseDate === k.CaseDate).CaseCount) )
        },
      ];
    }
    return opts;
  }

  ngOnDestroy(): void {
    this.themeSubscription.unsubscribe();
  }

  onHeaderClick(): void {
    this.HeaderClick.emit(this.SelectedData.Location);
  }

}
