import { Component, Input, OnChanges, OnDestroy, ViewChild, ElementRef,  } from '@angular/core';
import { i18n, IChartType, IDataVax, GetVaxTestChartTypes} from './../data/data.model';
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
  selector: 'app-chart-vax2',
  styleUrls: ['chart.case.component.scss'],
  template: `
  <nb-card [accent]="Accent">
    <nb-card-header>
    {{Title}}
    </nb-card-header>

    <nb-card-body *ngIf="SelectedData; else loading">
    <div class="row">
        <div class="col-6" style="text-align:center;">
          <app-info-panel-sm
            [TotalNum] = "this.TotalVax1"
            [DailyNum] = "this.LatestVax1"
            [CaseTitle] = "this.TotalVax1Str"
            [Lang] = "this.Lang"
          >
          </app-info-panel-sm>
        </div>
        <div class="col-6"  style="text-align:center;">
          <app-info-panel-sm
            [TotalNum] = "this.TotalVax2"
            [DailyNum] = "this.LatestVax2"
            [CaseTitle] = "this.TotalVax2Str"
            [Lang] = "this.Lang"
          >
          </app-info-panel-sm>
        </div>
      </div>
      <br />


      <div class="row">
        <div class="col-12 d-flex justify-content-center">
          <label class="radio-inline pointer">
            <input #optV1 type="radio" name="optVax" id="optV1" value="1" (change)="onOptChange()" >{{this.TotalVax1Str}}
          </label>&nbsp;&nbsp;&nbsp;
          <label class="radio-inline pointer">
            <input #optV2 type="radio" name="optVax" id="optV2" value="2" checked  (change)="onOptChange()">{{this.TotalVax2Str}}
          </label>
        </div>
      </div>
      <div class="row">
        <div class="col-12 d-flex justify-content-center">
            <select #optChartType class="form-control form-control-sm pointer" style="width:auto;padding:0px 28px;" aria-label=".form-select-sm example" [value]="this.SelectedChartType" (change)="this.onOptChange()">
              <option *ngFor="let i = index; let chartType of this.ChartTypes" [value]="chartType.Value" [selected]="chartType.Value === this.SelectedChartType" >{{chartType.DisplayText}}</option>
            </select>
        </div>
      </div>

    <div echarts
        [options]="options"
        [initOpts]="this.initOpts"
        class="demo-chart"
        (chartInit)="onChartInit($event)"
        style="height: 278px;overflow:hidden">
      </div>
    </nb-card-body>
  </nb-card>
  <ng-template #loading>
    <app-loading></app-loading>
  </ng-template>

  `,
  styles: [],
})
export class ChartVax2Component implements OnChanges, OnDestroy {
  options: any = {};
  ChartTypeOptions: IChartTypeOptions;
  Title: string;
  axisLabelColor: string;
  themeSubscription: Subscription;
  SelectedChartType = 'DAILY';
  ChartTypes: IChartType[];
  ChartsInstance;

  TotalVax1: number;
  TotalVax1Str: string;
  TotalVax2: number;
  TotalVax2Str: string;
  LatestVax1: number;
  LatestVax2: number;
  optVaxMode = 2;

  @Input() SelectedData: IDataVax;
  @Input() Lang: string;
  @Input() Accent: string;

  @ViewChild ('optV1') optV1: ElementRef<HTMLInputElement>;
  @ViewChild ('optV2') optV2: ElementRef<HTMLInputElement>;
  @ViewChild ('optChartType') optChartType: ElementRef<HTMLSelectElement>;


  initOpts = {
    locale: 'en'
  };

  constructor(private themeSvc: NbThemeService){}

  onChartInit(ec): void {
    this.ChartsInstance = ec;
  }

  setOptions(): void{
    const count = this.SelectedData.Dose1Cum.length - 1;

    this.TotalVax1 = this.SelectedData.Dose1Cum[count].CaseCount;
    this.TotalVax2 = this.SelectedData.Dose2Cum[count].CaseCount;
    this.TotalVax1Str = i18n.VAX_DOSE1[this.Lang];
    this.TotalVax2Str = i18n.VAX_DOSE2[this.Lang];
    this.LatestVax1 = this.SelectedData.Dose1[count].CaseCount;
    this.LatestVax2 = this.SelectedData.Dose2[count].CaseCount;

    this.themeSubscription = this.themeSvc.getJsTheme().subscribe(config => {

      const echarts: any = config.variables.echarts;

      const dt: IDataVax = this.SelectedData;
      this.initOpts.locale = this.Lang;
      this.options = {
        animation: true,
        animationDuration: (idx: number) => {
          return idx * 3;
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
          data: this.setChartTypeOptions(this.SelectedChartType, this.optVaxMode, this.Lang).legendData,
          textStyle: {
            color: echarts.textColor,
          },
          borderWidth: 1,
          top: 12
        },
        grid: {
            top: 75,
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
            start: 50,
            end: 100,
          }, {
            // id: 'dataZoomY',
            // filterMode: 'none',
            // start: 0,
            // end: 10
        }],

        series: this.setChartTypeOptions(this.SelectedChartType, this.optVaxMode , this.Lang).series,
      };
    });
  }

  ngOnChanges(): void {
    if (this.SelectedData !== undefined){
      this.setOptions();
      this.ChartTypes = GetVaxTestChartTypes(this.Lang);
      this.Title = i18n.VAX_DOSE[this.Lang] ;
    }
  }

  setChartTypeOptions(type: string, mode: number, lang: string): IChartTypeOptions {
    const dt: IDataVax = this.SelectedData;
    const opts: IChartTypeOptions = { legendData: [], series: [] };

    const v1GrowthRate = dt.Dose1Cum.map((n, i) => dt.Dose1Cum[i - 1] ===  undefined ? 0
                        : (n.CaseCount - dt.Dose1Cum[i - 1].CaseCount) / dt.Dose1Cum[i - 1].CaseCount * 100);
    const v2GrowthRate = dt.Dose2Cum.map((n, i) => dt.Dose2Cum[i - 1] ===  undefined ? 0
                        : (n.CaseCount - dt.Dose2Cum[i - 1].CaseCount) / dt.Dose2Cum[i - 1].CaseCount * 100);
    const v1Doubling = v1GrowthRate.map(n => Math.log(1 + (n / 100)) === 0 ? NaN
                      : Math.log(2) / Math.log(1 + (n / 100)));
    const v2Doubling = v2GrowthRate.map(n => Math.log(1 + (n / 100)) === 0 ? NaN
                      : Math.log(2) / Math.log(1 + (n / 100)));


    if (mode === 1) {
      if (type === 'DAILY') {
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
      if (type === 'CUMULATIVE') {
        opts.legendData = [i18n.VAX_DOSE1[lang]];
        opts.series = [{
          name: i18n.VAX_DOSE1[lang],
          type: 'bar',
          data: dt.Dose1Cum.map(k => k.CaseCount)
        }, ];
      }
      if (type === 'GROWTH_RATE') {
        opts.legendData = [i18n.GROWTH_RATE_PCT[lang]];
        opts.series = [{
          name: i18n.GROWTH_RATE_PCT[lang],
          type: 'line',
          data: v1GrowthRate.map(n => parseFloat(n.toFixed(2))),
        }, ];
      }
      if (type === 'DOUBLING_TIME') {
        opts.legendData = [i18n.DOUBLING_TIME_DAY[lang]];
        opts.series = [{
          name: i18n.DOUBLING_TIME_DAY[lang],
          type: 'line',
          data: v1Doubling.map(n => parseFloat(n.toFixed(2))),
        }, ];
      }
    }
    if (mode === 2) {
      if (type === 'DAILY') {
        opts.legendData = [i18n.VAX_DOSE2[lang]];
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
      if (type === 'CUMULATIVE') {
        opts.legendData = [i18n.VAX_DOSE2[lang]];
        opts.series = [{
          name: i18n.VAX_DOSE2[lang],
          type: 'bar',
          data: dt.Dose2Cum.map(k => k.CaseCount)
        }, ];
      }
      if (type === 'GROWTH_RATE') {
        opts.legendData = [i18n.GROWTH_RATE_PCT[lang]];
        opts.series = [{
          name: i18n.GROWTH_RATE_PCT[lang],
          type: 'line',
          data: v2GrowthRate.map(n => parseFloat(n.toFixed(2))),
        }, ];
      }
      if (type === 'DOUBLING_TIME') {
        opts.legendData = [i18n.DOUBLING_TIME_DAY[lang]];
        opts.series = [{
          name: i18n.DOUBLING_TIME_DAY[lang],
          type: 'line',
          data: v2Doubling.map(n => parseFloat(n.toFixed(2))),
        }, ];
      }
    }

    return opts;
  }

  onOptChange(): void{
    this.SelectedChartType = this.optChartType.nativeElement.value;
    this.optVaxMode = parseInt ((this.optV1.nativeElement.checked && this.optV1.nativeElement.value)
                      || (this.optV2.nativeElement.checked && this.optV2.nativeElement.value), 10);
    console.log('this.optVaxMode', this.optVaxMode);
    console.log('this.SelectedChartType', this.SelectedChartType);
    this.setOptions();
  }

  ngOnDestroy(): void {
    this.themeSubscription.unsubscribe();
  }
}
