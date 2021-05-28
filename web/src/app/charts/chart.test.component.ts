import { Component, OnInit, Input, OnChanges, OnDestroy,  } from '@angular/core';
import { i18n, IChartType, GetTestChartTypes, IDataVax} from './../data/data.model';
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
  selector: 'app-chart-test',
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
            [CaseTitle] = "this.TotalPeopleStr"
            [Lang] = "this.Lang"
          >
          </app-info-panel-sm>
        </div>
        <div class="col-6"  style="text-align:center;">
          <app-info-panel-sm
            [TotalNum] = "this.TotalSpecimen"
            [CaseTitle] = "this.TotalSpecimenStr"
            [Lang] = "this.Lang"
          >
          </app-info-panel-sm>
        </div>
      </div>
      <br />
      <div class="row">
        <div class="col-12 d-flex justify-content-center">
            <select class="form-control form-control-sm" style="width:auto" aria-label=".form-select-sm example" [value]="this.SelectedChartType" (change)="this.onChartTypeChange($event.target.value)">
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
export class ChartTestComponent implements OnChanges, OnDestroy {
  options: any;
  ChartTypeOptions: IChartTypeOptions;
  Title: string;
  axisLabelColor: string;
  themeSubscription: Subscription;
  ChartTypes: IChartType[];
  SelectedChartType = 'TESTED_PEOPLE';

  TotalPeopleStr: string;
  TotalSpecimenStr: string;
  TotalPeople: number;
  TotalSpecimen: number;
  LatestPeople: number;
  LatestSpecimen: number;

  @Input() Accent: string;
  @Input() SelectedData: IDataVax;
  @Input() Lang: string;

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
        series: this.setChartTypeOptions(this.SelectedChartType, this.Lang).series,
      };
    });
  }

  ngOnChanges(): void {
    if (this.SelectedData !== undefined){
      this.setOptions();
      this.ChartTypes = GetTestChartTypes(this.Lang);
      this.Title = i18n.TESTED_SPECIMEN_PEOPLE[this.Lang] ;
    }
  }

  onChartTypeChange(selectedValue: string): void{
    this.SelectedChartType = selectedValue;
    this.setOptions();

    console.log(this.SelectedChartType);
  }

  setChartTypeOptions(type: string, lang: string): IChartTypeOptions {
    const dt: IDataVax = this.SelectedData;
    const opts: IChartTypeOptions = { legendData: [], series: [] };
    if (type === 'TESTED_PEOPLE') {
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
    if (type === 'TESTED_SPECIMEN') {
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
    return opts;
  }

  ngOnDestroy(): void {
    this.themeSubscription.unsubscribe();
  }

}
