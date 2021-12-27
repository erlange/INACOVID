import { Component, Input, OnChanges, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { i18n, IChartType, GetVaxTestChartTypes, IDataVax} from './../data/data.model';
import { NbThemeService } from '@nebular/theme';
import * as Utils from './../data/data.utils';
import { formatDate, formatNumber } from '@angular/common';
import { Subscription } from 'rxjs';

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
  selector: 'app-chart-test2',
  styleUrls: ['chart.case.component.scss'],
  template: `
  <nb-card [accent]="Accent">
    <nb-card-header>
      {{Title}}
    </nb-card-header>

    <nb-card-body>
      <div class="row">
        <div class="col-6" style="text-align:center;">
          <app-info-panel-sm
            [TotalNum] = "this.TotalPeople"
            [DailyNum] = "this.LatestPeople"
            [CaseTitle] = "this.TotalPeopleStr"
            [Lang] = "this.Lang"
          >
          </app-info-panel-sm>
        </div>
        <div class="col-6"  style="text-align:center;">
          <app-info-panel-sm
            [TotalNum] = "this.TotalSpecimen"
            [DailyNum] = "this.LatestSpecimen"
            [CaseTitle] = "this.TotalSpecimenStr"
            [Lang] = "this.Lang"
          >
          </app-info-panel-sm>
        </div>
      </div>
      <br />

      <div class="row">
        <div class="col-12 d-flex justify-content-center">
          <label class="radio-inline pointer">
            <input #optV1 type="radio" name="optTest" id="optV1" value="1" checked (change)="onOptChange()" >{{this.TotalPeopleStr}}
          </label>&nbsp;&nbsp;&nbsp;
          <label class="radio-inline pointer">
            <input #optV2 type="radio" name="optTest" id="optV2" value="2" (change)="onOptChange()">{{this.TotalSpecimenStr}}
          </label>
        </div>
      </div>

      <div class="row">
        <div class="col-12 d-flex justify-content-center">
            <select #optChartType class="form-control form-control-sm pointer" style="width:auto" aria-label=".form-select-sm example" [value]="this.SelectedChartType" (change)="onOptChange()">
              <option *ngFor="let i = index; let chartType of this.ChartTypes" [value]="chartType.Value" [selected]="chartType.Value === this.SelectedChartType" >{{chartType.DisplayText}}</option>
            </select>
        </div>
      </div>

      <div echarts [options]="options" [initOpts]="this.initOpts" class="demo-chart" style="height: 278px;overflow:hidden"></div>
    </nb-card-body>
  </nb-card>
  `,
  styles: [],
})
export class ChartTest2Component implements OnChanges, OnDestroy {
  options: any;
  ChartTypeOptions: IChartTypeOptions;
  Title: string;
  axisLabelColor: string;
  themeSubscription: Subscription;
  ChartTypes: IChartType[];
  SelectedChartType = 'DAILY';

  TotalPeopleStr: string;
  TotalSpecimenStr: string;
  TotalPeople: number;
  TotalSpecimen: number;
  LatestPeople: number;
  LatestSpecimen: number;
  optTestMode = 1;

  @Input() Accent: string;
  @Input() SelectedData: IDataVax;
  @Input() Lang: string;

  @ViewChild ('optV1') optV1: ElementRef<HTMLInputElement>;
  @ViewChild ('optV2') optV2: ElementRef<HTMLInputElement>;
  @ViewChild ('optChartType') optChartType: ElementRef<HTMLSelectElement>;

  initOpts = {
    locale: 'en'
  };

  constructor(private themeSvc: NbThemeService){
  }

  setOptions(): void{
    const count = this.SelectedData.PplAntigenCum.length - 1;

    this.LatestPeople = this.SelectedData.PplAntigen[count].CaseCount + this.SelectedData.PplPcrTcm[count].CaseCount;
    this.TotalPeople = this.SelectedData.PplAntigenCum[count].CaseCount + this.SelectedData.PplPcrTcmCum[count].CaseCount;
    this.LatestSpecimen = this.SelectedData.SpecAntigen[count].CaseCount + this.SelectedData.SpecPcrTcm[count].CaseCount;
    this.TotalSpecimen = this.SelectedData.SpecAntigenCum[count].CaseCount + this.SelectedData.SpecPcrTcmCum[count].CaseCount;

    this.TotalPeopleStr = i18n.TESTED_PEOPLE[this.Lang];
    this.TotalSpecimenStr = i18n.TESTED_SPECIMEN[this.Lang];

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
          data: this.setChartTypeOptions(this.SelectedChartType, this.optTestMode, this.Lang).legendData,
          // backgroundColor: '#fff',
          borderWidth: 1,
          textStyle: {
            color: echarts.textColor,
          },
          top: 12,
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
          // id: 'dataZoomY',
          // filterMode: 'none',
          // start: 0,
          // end: 10
        }],

        // replaceMerge: ['xAxis', 'yAxis', 'grid'],
        series: this.setChartTypeOptions(this.SelectedChartType, this.optTestMode, this.Lang).series,
      };
    });
  }

  ngOnChanges(): void {
    if (this.SelectedData !== undefined){
      this.setOptions();
      this.ChartTypes = GetVaxTestChartTypes(this.Lang);
      this.Title = i18n.TESTED_SPECIMEN_PEOPLE[this.Lang] ;
    }
  }

  onChartTypeChange(selectedValue: string): void{
    this.SelectedChartType = selectedValue;
    this.setOptions();
  }

  setChartTypeOptions(type: string, mode: number, lang: string): IChartTypeOptions {
    const dt: IDataVax = this.SelectedData;
    const opts: IChartTypeOptions = { legendData: [], series: [] };

    const pplTotal = dt.PplPcrTcmCum.map((n, i) => n.CaseCount + dt.PplAntigenCum[i].CaseCount);
    const specTotal = dt.SpecPcrTcmCum.map((n, i) => n.CaseCount + dt.SpecAntigenCum[i].CaseCount);

    const pplPcrGrowth = dt.PplPcrTcmCum.map((n, i) => dt.PplPcrTcmCum[i - 1] === undefined ? 0 : dt.PplPcrTcmCum[i - 1].CaseCount === 0 ? 0
                          : (n.CaseCount - dt.PplPcrTcmCum[i - 1].CaseCount) / dt.PplPcrTcmCum[i - 1].CaseCount * 100);
    // tslint:disable-next-line: max-line-length
    const pplAntigenGrowth = dt.PplAntigenCum.map((n, i) => dt.PplAntigenCum[i - 1] === undefined ? 0 : dt.PplAntigenCum[i - 1].CaseCount === 0 ? 0
                          : (n.CaseCount - dt.PplAntigenCum[i - 1].CaseCount) / dt.PplAntigenCum[i - 1].CaseCount * 100);
    const pplTotalGrowth = pplTotal.map((n, i) => pplTotal[i - 1] === undefined ? 0 : pplTotal[i - 1] === 0 ? 0
                          : (n - pplTotal[i - 1]) / pplTotal[i - 1] * 100);

    const pplPcrDoubling = pplPcrGrowth.map(n => Math.log(1 + (n / 100)) === 0 ? NaN
                            : Math.log(2) / Math.log(1 + (n / 100)));

    const pplAntigenDoubling = pplAntigenGrowth.map(n => Math.log(1 + (n / 100)) === 0 ? NaN
                            : Math.log(2) / Math.log(1 + (n / 100)));

    // tslint:disable-next-line: max-line-length
    const specPcrGrowth = dt.SpecPcrTcmCum.map((n, i) => dt.SpecPcrTcmCum[i - 1] === undefined ? 0 : dt.SpecPcrTcmCum[i - 1].CaseCount === 0 ? 0
                          : (n.CaseCount - dt.SpecPcrTcmCum[i - 1].CaseCount) / dt.SpecPcrTcmCum[i - 1].CaseCount * 100);
    // tslint:disable-next-line: max-line-length
    const specAntigenGrowth = dt.SpecAntigenCum.map((n, i) => dt.SpecAntigenCum[i - 1] === undefined ? 0 : dt.SpecAntigenCum[i - 1].CaseCount === 0 ? 0
                          : (n.CaseCount - dt.SpecAntigenCum[i - 1].CaseCount) / dt.SpecAntigenCum[i - 1].CaseCount * 100);
    const specTotalGrowth = specTotal.map((n, i) => specTotal[i - 1] === undefined ? 0 : specTotal[i - 1] === 0 ? 0
                          : (n - specTotal[i - 1]) / specTotal[i - 1] * 100);

    const specTotalDoubling = specTotal.map(n => Math.log(1 + (n / 100)) === 0 ? NaN
                          : Math.log(2) / Math.log(1 + (n / 100)));

    const specPcrDoubling = specPcrGrowth.map(n => Math.log(1 + (n / 100)) === 0 ? NaN
                          : Math.log(2) / Math.log(1 + (n / 100)));

    const specAntigenDoubling = specAntigenGrowth.map(n => Math.log(1 + (n / 100)) === 0 ? NaN
                          : Math.log(2) / Math.log(1 + (n / 100)));


    if (mode === 1) {
      if (type === 'DAILY') {
        opts.legendData = [i18n.TESTED_PEOPLE_PCR[lang], i18n.TESTED_PEOPLE_ANTIGEN[lang], i18n.MOVING_AVERAGE_7[lang]];
        opts.series = [{
            name: i18n.TESTED_PEOPLE_PCR[lang],
            type: 'bar',
            stack: 'case',
            data: dt.PplPcrTcm.map(k => k.CaseCount)
          },
          {
            name: i18n.TESTED_PEOPLE_ANTIGEN[lang],
            type: 'bar',
            stack: 'case',
            data: dt.PplAntigen.map(k => k.CaseCount)
          },
          {
            name: i18n.MOVING_AVERAGE_7[lang],
            type: 'line',
            data: Utils.movingAvg(dt.PplPcrTcm.map((n, i) => n.CaseCount + dt.PplAntigen[i].CaseCount), 7, 0).map(n => Math.round(n))
          }];
      }
      if (type === 'CUMULATIVE') {
        opts.legendData = [i18n.TESTED_PEOPLE_PCR[lang], i18n.TESTED_PEOPLE_ANTIGEN[lang], i18n.TOTAL[lang]];
        opts.series = [{
          name: i18n.TESTED_PEOPLE_PCR[lang],
          type: 'bar',
          stack: 'case',
          data: dt.PplPcrTcmCum.map(k => k.CaseCount)
        },
        {
          name: i18n.TESTED_PEOPLE_ANTIGEN[lang],
          type: 'bar',
          stack: 'case',
          data: dt.PplAntigenCum.map(k => k.CaseCount)
        },
        {
          name: i18n.TOTAL[lang],
          type: 'scatter',
          data: pplTotal
        }, ];
      }
      if (type === 'GROWTH_RATE') {
        opts.legendData = [i18n.TESTED_PEOPLE_PCR[lang] + ' (%)', i18n.TESTED_PEOPLE_ANTIGEN[lang] + ' (%)', i18n.TOTAL[lang]  + ' (%)'];
        opts.series = [{
          name: i18n.TESTED_PEOPLE_PCR[lang] + ' (%)',
          type: 'line',
          data: pplPcrGrowth.map(n => parseFloat(n.toFixed(2))),
        },
        {
          name: i18n.TESTED_PEOPLE_ANTIGEN[lang] + ' (%)',
          type: 'line',
          data: pplAntigenGrowth.map(n => parseFloat(n.toFixed(2))),
        },
        {
          name: i18n.TOTAL[lang] + ' (%)',
          type: 'line',
          data: pplTotalGrowth.map(n => parseFloat(n.toFixed(2))),
        }, ];
      }
      if (type === 'DOUBLING_TIME') {
        opts.legendData = [i18n.TESTED_PEOPLE_PCR[lang], i18n.TESTED_PEOPLE_ANTIGEN[lang]];
        opts.series = [{
          name: i18n.TESTED_PEOPLE_PCR[lang],
          type: 'line',
          data: pplPcrDoubling.map(n => parseFloat(n.toFixed(2))),
        },
        {
          name: i18n.TESTED_PEOPLE_ANTIGEN[lang],
          type: 'line',
          data: pplAntigenDoubling.map(n => parseFloat(n.toFixed(2))),
        }, ];
      }
    }
    if (mode === 2) {
      if (type === 'DAILY') {
        opts.legendData = [i18n.TESTED_SPECIMEN_PCR[lang], i18n.TESTED_SPECIMEN_ANTIGEN[lang], i18n.MOVING_AVERAGE_7[lang]];
        opts.series = [{
            name: i18n.TESTED_SPECIMEN_PCR[lang],
            type: 'bar',
            stack: 'case',
            data: dt.SpecPcrTcm.map(k => k.CaseCount)
          },
          {
            name: i18n.TESTED_SPECIMEN_ANTIGEN[lang],
            type: 'bar',
            stack: 'case',
            data: dt.SpecAntigen.map(k => k.CaseCount)
          },
          {
            name: i18n.MOVING_AVERAGE_7[lang],
            type: 'line',
            data: Utils.movingAvg(dt.SpecPcrTcm.map((n, i) => n.CaseCount + dt.SpecAntigen[i].CaseCount), 7, 0).map(n => Math.round(n))
          }, ];
      }
      if (type === 'CUMULATIVE') {
        opts.legendData = [i18n.TESTED_SPECIMEN_PCR[lang], i18n.TESTED_SPECIMEN_ANTIGEN[lang], i18n.TOTAL[lang]];
        opts.series = [{
          name: i18n.TESTED_SPECIMEN_PCR[lang],
          type: 'bar',
          stack: 'case',
          data: dt.SpecPcrTcmCum.map(k => k.CaseCount)
        },
        {
          name: i18n.TESTED_SPECIMEN_ANTIGEN[lang],
          type: 'bar',
          stack: 'case',
          data: dt.SpecAntigenCum.map(k => k.CaseCount)
        },
        {
          name: i18n.TOTAL[lang],
          type: 'scatter',
          data: specTotal
        }, ];
      }
      if (type === 'GROWTH_RATE') {
        // tslint:disable-next-line: max-line-length
        opts.legendData = [i18n.TESTED_SPECIMEN_PCR[lang] + ' (%)', i18n.TESTED_SPECIMEN_ANTIGEN[lang] + ' (%)', i18n.TOTAL[lang]  + ' (%)'];
        opts.series = [{
          name: i18n.TESTED_SPECIMEN_PCR[lang] + ' (%)',
          type: 'line',
          data: specPcrGrowth.map(n => parseFloat(n.toFixed(2))),
        },
        {
          name: i18n.TESTED_SPECIMEN_ANTIGEN[lang] + ' (%)',
          type: 'line',
          data: specAntigenGrowth.map(n => parseFloat(n.toFixed(2))),
        },
        {
          name: i18n.TOTAL[lang] + ' (%)',
          type: 'line',
          data: specTotalGrowth.map(n => parseFloat(n.toFixed(2))),
        }, ];
      }
      if (type === 'DOUBLING_TIME') {
        opts.legendData = [i18n.TESTED_SPECIMEN_PCR[lang], i18n.TESTED_SPECIMEN_ANTIGEN[lang]];
        opts.series = [{
          name: i18n.TESTED_SPECIMEN_PCR[lang],
          type: 'line',
          data: specPcrDoubling.map(n => parseFloat(n.toFixed(2))),
        },
        {
          name: i18n.TESTED_SPECIMEN_ANTIGEN[lang],
          type: 'line',
          data: specAntigenDoubling.map(n => parseFloat(n.toFixed(2))),
        }, ];
      }


    }

    return opts;
  }

  onOptChange(): void{
    this.SelectedChartType = this.optChartType.nativeElement.value;
    this.optTestMode = parseInt ((this.optV1.nativeElement.checked && this.optV1.nativeElement.value)
                      || (this.optV2.nativeElement.checked && this.optV2.nativeElement.value), 10);
    console.log('this.optVaxMode', this.optTestMode);
    console.log('this.SelectedChartType', this.SelectedChartType);
    this.setOptions();
  }

  ngOnDestroy(): void {
    this.themeSubscription.unsubscribe();
  }

}
