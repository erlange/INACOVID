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
  selector: 'app-chart-prov',
  styleUrls: ['chart.case.component.scss'],
  template: `
  <nb-card [accent]="Accent">
    <nb-card-header>
      {{Title}}
      <ng-content></ng-content>
    </nb-card-header>

    <nb-card-body *ngIf="Cases;else loading">
      <div echarts [options]="options" [initOpts]="this.initOpts" class="echart" style="height: 678px;overflow:hidden"></div>
    </nb-card-body>
  </nb-card>
  <ng-template #loading>
    <app-loading></app-loading>
  </ng-template>

  `,
  styles: [],
})
export class ChartProvComponent implements OnChanges, OnDestroy {
  options: any;
  ChartTypeOptions: IChartTypeOptions;
  Title: string;
  axisLabelColor: string;
  themeSubscription: Subscription;

  @Input() Accent: string;
  @Input() Cases: IData[];
  @Input() Lang: string;

  initOpts = {
    locale: 'en'
  };

  constructor(private themeSvc: NbThemeService){}

  setOptions(): void{
    this.themeSubscription = this.themeSvc.getJsTheme().subscribe(config => {

      const echarts: any = config.variables.echarts;
      const dt: IData[] = this.Cases.filter(n => n.Location !== 'Nasional');

      const data = dt.map(n => {
        return {Location: n.Location, Latest: Utils.getLatest(dt, n.Location)};
      });
      data.sort((m, n) => m.Latest.ConfirmedCum - n.Latest.ConfirmedCum );

      const lang = this.Lang;
      this.initOpts.locale = lang;
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
          data:  [i18n.CONFIRMED[lang], i18n.ACTIVE[lang], i18n.RECOVERED[lang], i18n.DEATHS[lang]],
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
          bottom: '5%',
          containLabel: true
        },
        toolbox: {
          feature: {
              saveAsImage: { title: 'Save As PNG', show: true },
            }
        },
        yAxis: {
          type: 'category',
          boundaryGap: false,
          axisLabel: {
            textStyle: {
              color: echarts.textColor,
            },
          },
        data: data.map(n => n.Location),
        color: echarts.textColor,
        },
        xAxis: {
          type: 'value',
          axisLabel: {
            formatter: (value: number) => {
              return formatNumber(value, lang);
            },
            textStyle: {
              color: echarts.textColor,
            },
            }
        },
        // dataZoom: [{
        //     // id: 'dataZoomY',
        //     // type: 'inside',
        //     // filterMode: 'filter',
        //     // start: 50,
        //     // end: 100
        //   }, {
        //     id: 'dataZoomY',
        //     type: 'inside',
        //     filterMode: 'filter',
        //     start: 50,
        //     end: 100
        // }],
        series: [
          {
            name: i18n.DEATHS[lang],
            type: 'bar',
            stack: 'case',
            data: data.map(n => n.Latest.DeadCum),
            // data: dt.map(n => n.DeadCum[n.DeadCum.length - 1].CaseCount).sort((a, b) => a - b),
          },
          {
            name: i18n.RECOVERED[lang],
            type: 'bar',
            stack: 'case',
            data: data.map(n => n.Latest.CuredCum),
            // data: dt.map(n => n.CuredCum[n.CuredCum.length - 1].CaseCount).sort((a, b) => a - b),
          },
          {
            name: i18n.ACTIVE[lang],
            type: 'bar',
            stack: 'case',
            data: data.map(n => n.Latest.ConfirmedCum - n.Latest.CuredCum - n.Latest.DeadCum),
            // data: dt.map(n => n.ConfirmedCum[n.ConfirmedCum.length - 1].CaseCount
            //   - n.CuredCum[n.CuredCum.length - 1].CaseCount
            //   - n.DeadCum[n.DeadCum.length - 1].CaseCount).sort((a, b) => a - b),
          },
          {
            name: i18n.CONFIRMED[lang],
            type: 'scatter',
            data: data.map(n => n.Latest.ConfirmedCum),
            // data: dt.map(n => n.ConfirmedCum[n.ConfirmedCum.length - 1].CaseCount).sort((a, b) => a - b),
          },
        ],
      };
    });
  }

  ngOnChanges(): void {
    if (this.Cases){
      this.setOptions();
      this.Title = i18n.BY_PROVINCES[this.Lang].toUpperCase();
    }
  }

  ngOnDestroy(): void {
    this.themeSubscription.unsubscribe();
  }


}
