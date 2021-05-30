import { Component, Input, OnChanges, OnDestroy, EventEmitter, Output} from '@angular/core';
import {IData, i18n, IChartType, GetChartTypes, IHospital, IHospitalBed} from './../data/data.model';
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
  selector: 'app-chart-hosp',
  styleUrls: ['chart.case.component.scss'],
  template: `
  <nb-card [accent]="Accent">
    <nb-card-header>
      {{Title}}
      <ng-content></ng-content>
    </nb-card-header>

    <nb-card-body *ngIf="Hospitals;else loading">
      <div echarts [options]="options" [initOpts]="this.initOpts" class="echart" style="height: 678px;overflow:hidden"></div>
    </nb-card-body>
  </nb-card>
  <ng-template #loading>
    <app-loading></app-loading>
  </ng-template>

  `,
  styles: [],
})
export class ChartHospComponent implements OnChanges, OnDestroy {
  options: any;
  ChartTypeOptions: IChartTypeOptions;
  Title: string;
  axisLabelColor: string;
  themeSubscription: Subscription;
  beds = [] as IHospitalBed[];


  @Input() Accent: string;
  @Input() Hospitals: IHospital[];
  @Input() Lang: string;

  initOpts = {
    locale: 'en'
  };

  constructor(private themeSvc: NbThemeService){}

  setOptions(): void{
    this.themeSubscription = this.themeSvc.getJsTheme().subscribe(config => {

      const echarts: any = config.variables.echarts;

      // https://stackoverflow.com/questions/23359173/javascript-reduce-an-empty-array#67690764
      this.beds = [] as IHospitalBed[];
      this.Hospitals.reduce((res, value) => {
        if (!res[value.Province]) {
          res[value.Province] = { Province: value.Province, Capacity: 0 };
          this.beds.push(res[value.Province]);
        }
        res[value.Province].Capacity += value.Capacity;
        return res;
      }, []);
      this.beds.sort((a, b) => a.Capacity - b.Capacity);

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
          data:  [i18n.BEDDING_NUM[lang]],
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
        data: this.beds.map(n => n.Province),
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
            name: i18n.BEDDING_NUM[lang],
            type: 'bar',
            stack: 'case',
            data: this.beds.map(m => m.Capacity),
            // data: dt.map(n => n.DeadCum[n.DeadCum.length - 1].CaseCount).sort((a, b) => a - b),
          },
        ],
      };
    });
  }

  ngOnChanges(): void {
    if (this.Hospitals){
      this.setOptions();
      this.Title = i18n.HOSPITAL_BEDDING_CAPACITY[this.Lang].toUpperCase();
    }
  }

  ngOnDestroy(): void {
    this.themeSubscription.unsubscribe();
  }


}
