import { Component, Input, OnChanges, OnDestroy,  } from '@angular/core';
import { i18n, IChartType, GetVaxChartTypes, IDataVax} from './../data/data.model';
import { NbThemeService } from '@nebular/theme';
import * as Utils from './../data/data.utils';
import { formatDate } from '@angular/common';
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
  selector: 'app-chart-vax',
  styleUrls: ['chart.case.component.scss'],
  template: `
  <nb-card [accent]="Accent">
    <nb-card-header>
    {{Title}}
    </nb-card-header>

    <nb-card-body *ngIf="SelectedData; else loading">
      <div class="d-flex justify-content-center">
          <select class="form-control form-control-sm" style="width:auto;padding:0px 28px;" aria-label=".form-select-sm example" [value]="this.SelectedChartType" (change)="this.onChartTypeChange($event.target.value)">
            <option *ngFor="let i = index; let chartType of this.ChartTypes" [value]="chartType.Value" [selected]="chartType.Value === this.SelectedChartType" >{{chartType.DisplayText}}</option>
          </select>
      </div>
    <div echarts
        [options]="options"
        [initOpts]="this.initOpts"
        class="demo-chart"
        (chartInit)="onChartInit($event)"
        style="height: 224px;overflow:hidden">
      </div>
    </nb-card-body>
  </nb-card>
  <ng-template #loading>
    <app-loading></app-loading>
  </ng-template>

  `,
  styles: [],
})
export class ChartVaxComponent implements OnChanges, OnDestroy {
  options: any = {};
  ChartTypeOptions: IChartTypeOptions;
  Title: string;
  axisLabelColor: string;
  themeSubscription: Subscription;
  SelectedChartType = 'VAX_DOSE2';
  ChartTypes: IChartType[];
  ChartsInstance;

  @Input() SelectedData: IDataVax;
  @Input() Lang: string;
  @Input() Accent: string;

  initOpts = {
    locale: 'en'
  };

  constructor(private themeSvc: NbThemeService){}

  onChartInit(ec): void {
    this.ChartsInstance = ec;
  }

  setOptions(): void{
    this.themeSubscription = this.themeSvc.getJsTheme().subscribe(config => {

      const echarts: any = config.variables.echarts;

      const dt: IDataVax = this.SelectedData;
      this.initOpts.locale = this.Lang;
      this.options = {
        animation: false,
        animationDuration: (idx: number) => {
          return idx * 100;
        },
        title: {
            // text: i18n.VAX_DOSE[this.Lang],
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
          textStyle: {
            color: echarts.textColor,
          },
          borderWidth: 1,
          top: 12
        },
        grid: {
            top: 55,
            left: '3%',
            right: '4%',
            bottom: '20%',
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
            data: this.SelectedData.SpecPcrTcm
              .map(k => formatDate (Date.parse(k.CaseDate), i18n.DATE_FORMAT_MEDIUM[this.Lang], this.Lang )),
            axisLabel: {
              textStyle: {
                color: echarts.textColor,
              },
            }
        },
        yAxis: {
            type: 'value',
            axisLabel: {
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
            end: 100,
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
      this.ChartTypes = GetVaxChartTypes(this.Lang);
      this.Title = i18n.VAX_DOSE[this.Lang] ;
    }
  }

  onChartTypeChange(selectedValue: string): void{
    this.SelectedChartType = selectedValue;
    this.setOptions();
  }

  setChartTypeOptions(type: string, lang: string): IChartTypeOptions {
    const dt: IDataVax = this.SelectedData;
    const opts: IChartTypeOptions = { legendData: [], series: [] };
    if (type === 'VAX_DOSE1') {
      opts.legendData = [i18n.VAX_DOSE1[lang], i18n.MOVING_AVERAGE_7[lang]];
      opts.series = [{
          name: i18n.VAX_DOSE1[lang],
          type: 'bar',
          data: dt.Dose1.map(k => k.CaseCount)
        },
        {
          name: i18n.MOVING_AVERAGE_7[lang],
          type: 'line',
          data: Utils.movingAvg(dt.Dose1.map(k => k.CaseCount), 7, 0).map(n => Math.round(n))
        }, ];
    }
    if (type === 'VAX_DOSE2') {
      opts.legendData = [i18n.VAX_DOSE2[lang], i18n.MOVING_AVERAGE_7[lang]];
      opts.series = [{
          name: i18n.VAX_DOSE2[lang],
          type: 'bar',
          data: dt.Dose2.map(k => k.CaseCount)
        },
        {
          name: i18n.MOVING_AVERAGE_7[lang],
          type: 'line',
          data: Utils.movingAvg(dt.Dose2.map(k => k.CaseCount), 7, 0).map(n => Math.round(n))
        }, ];
    }
    return opts;
  }

  ngOnDestroy(): void {
    this.themeSubscription.unsubscribe();
  }
}
