import { Component, OnInit, Input, OnChanges, OnDestroy, EventEmitter, Output } from '@angular/core';
import {IData, i18n, IChartType, GetChartCumTypes} from '../data/data.model';
import * as Utils from '../data/data.utils';
import { formatDate, formatNumber } from '@angular/common';
import { Subscription } from 'rxjs';
import { NbThemeService } from '@nebular/theme';
// import * as EventEmitter from 'events';

interface IChartTypeOptionSerie{
  name: string;
  type: string;
  stack?: string;
  data: number[];
}

interface IChartTypeOptions{
  legendData: string[];
  series: IChartTypeOptionSerie[];
}


@Component({
  selector: 'app-chart-cum',
  template: `
  <nb-card [accent]="Accent">
    <nb-card-header>
      <span *ngIf="SelectedData" (click)="onHeaderClick()" class="headprov"><i class="fas fa-bars"></i> {{Title}}</span>
      <!-- <span *ngIf="SelectedData" (click)="onHeaderClick()">{{Title}}</span> -->
    </nb-card-header>
    <nb-card-body *ngIf="SelectedData; else loading">
      <div class="d-flex justify-content-center">
        <select class="form-control form-control-sm pointer" style="width:auto" aria-label=".form-select-sm example" [value]="this.SelectedChartType" (change)="this.onChartTypeChange($event.target.value)">
          <option *ngFor="let i = index; let chartType of this.ChartTypes" [value]="chartType.Value" [selected]="chartType.Value === this.SelectedChartType" >{{chartType.DisplayText}}</option>
        </select>
      </div>
      <div echarts [options]="options" [initOpts]="this.initOpts" style="height:224px"></div>
    </nb-card-body>
  </nb-card>

  <ng-template #loading>
    <app-loading></app-loading>
  </ng-template>
  `,
  styleUrls: ['chart.case.component.scss'],
  styles: [],
})
export class ChartCumComponent implements OnInit, OnChanges, OnDestroy {
  options: any;
  ChartTypeOptions: IChartTypeOptions ;
  Title: string;
  themeSubscription: Subscription;
  ChartTypes: IChartType[];
  SelectedChartType = 'ALL_CASES';

  @Input() SelectedData: IData;
  @Input() Lang: string;
  @Input() Accent: string;

  @Output() HeaderClick: EventEmitter<string> = new EventEmitter();


  initOpts = {
    locale: 'en'
  };

  constructor(private themeSvc: NbThemeService){}
  ngOnDestroy(): void {
    this.themeSubscription.unsubscribe();
  }

  ngOnInit(): void {
    // if (this.SelectedData !== undefined){
    //   this.setOptions();
    // }
  }

  setOptions(): void{
    this.themeSubscription = this.themeSvc.getJsTheme().subscribe(config => {
      const echarts: any = config.variables.echarts;

      const dt: IData = this.SelectedData;
      this.initOpts.locale = this.Lang;
      this.options = {
        animation: true,
        animationDuration: (idx: number) => {
          return idx * 2;
        },
        title: {
            // text: i18n.CUMULATIVE_CASES[this.Lang],
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
          },
          // formatter: '{b0}<br /> {a0}:{c0}<br />{a1}:{c1}<br />{a2}:{c2}'
        },
        legend: {
          data: this.setChartTypeOptions(this.SelectedChartType, this.Lang).legendData,
          // backgroundColor: '#fff',
          // borderColor: '#aaa',
          borderWidth: 1,
          textStyle: {
            color: echarts.textColor,
          },
          top: 16,
        },
        grid: {
          top: 60,
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
            // data: this.SelectedData.Confirmed.map(k => new Date(k.CaseDate)),

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
          start: 0,
          end: 100
          }, {
        }],

        series: this.setChartTypeOptions(this.SelectedChartType, this.Lang).series,
      };
    });
  }

  ngOnChanges(): void {
    if (this.SelectedData !== undefined){
      this.setOptions();
      this.ChartTypes = GetChartCumTypes(this.Lang);
      this.Title = i18n.CUMULATIVE_CASES[this.Lang] + ' - ' + this.SelectedData.Location;
      this.Title = this.Title.toUpperCase();
    }
  }

  onChartTypeChange(selectedValue: string): void{
    this.SelectedChartType = selectedValue;
    this.setOptions();
  }

  setChartTypeOptions(type: string, lang: string): IChartTypeOptions {
    const dt: IData = this.SelectedData;
    const opts: IChartTypeOptions = { legendData: [], series: [] };
    if (type === 'ALL_CASES') {
      opts.legendData = [i18n.CONFIRMED[lang], i18n.ACTIVE[lang], i18n.RECOVERED[lang], i18n.DEATHS[lang]];
      opts.series = [
        {
          name: i18n.DEATHS[lang],
          type: 'bar',
          stack: 'case',
          data: dt.DeadCum.map(k => k.CaseCount),
        },
        {
          name: i18n.RECOVERED[lang],
          type: 'bar',
          stack: 'case',
          data: dt.CuredCum.map(k => k.CaseCount)
        },
        {
          name: i18n.ACTIVE[lang],
          type: 'bar',
          stack: 'case',
          data: dt.ConfirmedCum.map(k => k.CaseCount - dt.CuredCum.find(l => l.CaseDate === k.CaseDate).CaseCount
          - dt.DeadCum.find(l => l.CaseDate === k.CaseDate).CaseCount )
        },
        {
          name: i18n.CONFIRMED[lang],
          type: 'line',
          data: dt.ConfirmedCum.map(k => k.CaseCount),
        },
      ];
    }

    if (type === 'FATALITY_RECOVERY_RATE') {
      opts.legendData = [i18n.FATALITY_RATE[lang], i18n.RECOVERY_RATE[lang]];
      opts.series = [{
          name: i18n.FATALITY_RATE[lang],
          type: 'line',
          data: dt.DeadCum.map(k => k.CaseCount / ((dt.ConfirmedCum.find(j => j.CaseDate === k.CaseDate).CaseCount) === 0 ?
            0 : dt.ConfirmedCum.find(j => j.CaseDate === k.CaseDate).CaseCount) ).map(n => parseFloat(n.toFixed(2)))
        },
        {
          name: i18n.RECOVERY_RATE[lang],
          type: 'line',
          data: dt.CuredCum.map(k => k.CaseCount / ((dt.ConfirmedCum.find(j => j.CaseDate === k.CaseDate).CaseCount) === 0 ?
          0 : dt.ConfirmedCum.find(j => j.CaseDate === k.CaseDate).CaseCount) ).map(n => parseFloat(n.toFixed(2)))
        }, ];
    }

    if (type === 'GROWTH_RATE') {
      opts.legendData = [i18n.CONFIRMED[lang], i18n.RECOVERED[lang], i18n.DEATHS[lang]];

      const activeCum = dt.ConfirmedCum.map(k => k.CaseCount - dt.CuredCum.find(l => l.CaseDate === k.CaseDate).CaseCount
                      - dt.DeadCum.find(l => l.CaseDate === k.CaseDate).CaseCount );

      opts.series = [
        {
          name: i18n.DEATHS[lang],
          type: 'line',
          data: dt.DeadCum.map((n, i) => dt.DeadCum[i - 1] === undefined ? 0 : dt.DeadCum[i - 1].CaseCount === 0 ? 0
              : (n.CaseCount - dt.DeadCum[i - 1].CaseCount) / dt.DeadCum[i - 1].CaseCount * 100 ).map(n => parseFloat(n.toFixed(2))),
        },
        {
          name: i18n.RECOVERED[lang],
          type: 'line',
          data: dt.CuredCum.map((n, i) => dt.CuredCum[i - 1] === undefined ? 0 : dt.CuredCum[i - 1].CaseCount === 0 ? 0
              : (n.CaseCount - dt.CuredCum[i - 1].CaseCount) / dt.CuredCum[i - 1].CaseCount * 100 ).map(n => parseFloat(n.toFixed(2))),
        },
        {
          name: i18n.CONFIRMED[lang],
          type: 'line',
          data: dt.ConfirmedCum.map((n, i) => dt.ConfirmedCum[i - 1] === undefined ? 0 : dt.ConfirmedCum[i - 1].CaseCount === 0 ? 0
              // tslint:disable-next-line: max-line-length
              : (n.CaseCount - dt.ConfirmedCum[i - 1].CaseCount) / dt.ConfirmedCum[i - 1].CaseCount * 100 ).map(n => parseFloat(n.toFixed(2))),
        },
      ];
    }

    if (type === 'DOUBLING_TIME') {
      opts.legendData = [i18n.CONFIRMED[lang], i18n.RECOVERED[lang], i18n.DEATHS[lang]];

      const activeCum = dt.ConfirmedCum.map(k => k.CaseCount - dt.CuredCum.find(l => l.CaseDate === k.CaseDate).CaseCount
                      - dt.DeadCum.find(l => l.CaseDate === k.CaseDate).CaseCount );

      // tslint:disable-next-line: max-line-length
      const confirmedGrowthRate = dt.ConfirmedCum.map((n, i) => dt.ConfirmedCum[i - 1] === undefined ? 0 : dt.ConfirmedCum[i - 1].CaseCount === 0 ? 0
                              : (n.CaseCount - dt.ConfirmedCum[i - 1].CaseCount) / dt.ConfirmedCum[i - 1].CaseCount * 100 );

      const deadGrowthRate = dt.DeadCum.map((n, i) =>  dt.DeadCum[i - 1] === undefined ? 0 :  dt.DeadCum[i - 1].CaseCount === 0 ? 0
                              : (n.CaseCount - dt.DeadCum[i - 1].CaseCount) / dt.DeadCum[i - 1].CaseCount * 100 );

      const curedGrowthRate = dt.CuredCum.map((n, i) => dt.CuredCum[i - 1] === undefined ? 0 : dt.CuredCum[i - 1].CaseCount === 0 ? 0
                              : (n.CaseCount - dt.CuredCum[i - 1].CaseCount) / dt.CuredCum[i - 1].CaseCount * 100 );

      opts.series = [
        {
          name: i18n.DEATHS[lang],
          type: 'line',
          data: deadGrowthRate.map(n => Math.log(1 + (n / 100)) === 0 ? NaN
              : Math.log(2) / Math.log(1 + (n / 100))).map(n => parseFloat(n.toFixed(2))),
        },
        {
          name: i18n.RECOVERED[lang],
          type: 'line',
          data: curedGrowthRate.map(n => Math.log(1 + (n / 100)) === 0 ? NaN
              : Math.log(2) / Math.log(1 + (n / 100))).map(n => parseFloat(n.toFixed(2))),
        },
        {
          name: i18n.CONFIRMED[lang],
          type: 'line',
          data: confirmedGrowthRate.map(n => Math.log(1 + (n / 100)) === 0 ? NaN
              : Math.log(2) / Math.log(1 + (n / 100))).map(n => parseFloat(n.toFixed(2))),
        },
      ];
    }
    if (type === 'ESTIMATED_R0') {
      const incubationTime = 5;
      const infectiousPeriod = 5;
      // tslint:disable-next-line: max-line-length
      const confirmedGrowthRate = dt.ConfirmedCum.map((n, i) => dt.ConfirmedCum[i - 1] === undefined ? 0 : dt.ConfirmedCum[i - 1].CaseCount === 0 ? 0
                              : (n.CaseCount - dt.ConfirmedCum[i - 1].CaseCount) / dt.ConfirmedCum[i - 1].CaseCount  );

      opts.legendData = [i18n.ESTIMATED_R0[lang]];
      opts.series = [
        {
          name: i18n.ESTIMATED_R0[lang],
          type: 'line',

          data: confirmedGrowthRate.map(n =>
            // based on SEIR model
            // R0 = (1 + lambda * incubationTime) * (1 + lambda * infectiousPeriod)
            (1 + Math.log(n + 1) * incubationTime) * (1 + Math.log(n + 1) * infectiousPeriod) ).map(n => parseFloat(n.toFixed(2))),
        },
      ];
    }

    return opts;
  }

  onHeaderClick(): void {
    this.HeaderClick.emit(this.SelectedData.Location);
  }

}
