import { Component, Input, OnChanges, OnDestroy, ViewChild } from '@angular/core';
import { i18n, IChartType, GetAgeChartTypes, IDataCategory} from './../data/data.model';
import { NbThemeService } from '@nebular/theme';
import { formatNumber, formatPercent } from '@angular/common';
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
  selector: 'app-chart-age',
  styleUrls: ['chart.case.component.scss'],
  template: `
  <nb-card [accent]="Accent">
    <nb-card-header>
      <ng-container *ngIf="SelectedData"> {{Title}}</ng-container>
    </nb-card-header>

    <nb-card-body *ngIf="SelectedData;else loading">
      <div class="d-flex justify-content-center">
        <select class="form-control form-control-sm" style="width: 200px" aria-label=".form-select-sm example" [value]="this.SelectedChartType" (change)="this.onChartTypeChange($event.target.value)">
          <option *ngFor="let i = index; let chartType of this.ChartTypes" [value]="chartType.Value" [selected]="chartType.Value === this.SelectedChartType" >{{chartType.DisplayText}}</option>
        </select>
        <!-- <select class="form-control form-control-sm" style="width: 200px" aria-label=".form-select-sm example" [value]="this.SelectedChartType" (change)="this.onChartTypeChange($event.target.value)">
          <option value="kondisi_penyerta" selected>Health Conditions</option>
          <option value="gejala">Symptoms</option>
        </select> -->
      </div>
      <div echarts [options]="options" [initOpts]="this.initOpts" class="echart" style="height: 328px;overflow:hidden"></div>
    </nb-card-body>
  </nb-card>
  <ng-template #loading>
    <app-loading></app-loading>
  </ng-template>

  `,
  styles: [],
})
export class ChartAgeComponent implements OnChanges, OnDestroy {
  options: any;
  ChartTypeOptions: IChartTypeOptions;
  Title: string;
  axisLabelColor: string;
  SelectedChartType = 'kelompok_umur';
  themeSubscription: Subscription;
  ChartTypes: IChartType[];

  @Input() Accent: string;
  @Input() SelectedData: IDataCategory[];
  @Input() Lang: string;


  initOpts = {
    locale: 'en'
  };

  constructor(private themeSvc: NbThemeService){}

  setOptions(): void{
    this.themeSubscription = this.themeSvc.getJsTheme().subscribe(config => {

      const echarts: any = config.variables.echarts;
      const dt: IDataCategory[] = this.SelectedData;
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
        yAxis: {
          type: 'value',
          boundaryGap: false,
          axisLabel: {
            formatter: (value: number) => {
              return formatPercent(value / 100, this.Lang);
            },
            textStyle: {
              color: echarts.textColor,
            },
          },
          color: echarts.textColor,
        },
        xAxis: {
          type: 'category',
          data: this.SelectedData.filter(n => n.Category === this.SelectedChartType).map(n => n.Subcategory),
          axisLabel: {
            textStyle: {
              color: echarts.textColor,
            },
          },
        },
        series: this.setChartTypeOptions(this.SelectedChartType, this.Lang).series,
      };
    });
  }

  ngOnChanges(): void {
    if (this.SelectedData !== undefined){
      this.setOptions();
      this.ChartTypes = GetAgeChartTypes(this.Lang);
      this.Title = i18n.AGE_GENDER[this.Lang] + ' - ' + this.SelectedData[0].Location;
      this.Title = this.Title.toUpperCase();
    }
  }

  onChartTypeChange(selectedValue: string): void{
    this.SelectedChartType = selectedValue;
    this.setOptions();
  }

  setChartTypeOptions(type: string, lang: string): IChartTypeOptions {
    const dt: IDataCategory[] = this.SelectedData;
    const opts: IChartTypeOptions = { legendData: [], series: [] };

    const kond = dt.filter(n => n.Category === type);
    opts.legendData = [i18n.CONFIRMED[lang], i18n.ACTIVE[lang], i18n.RECOVERED[lang], i18n.DEATHS[lang]];

    opts.series = [{
      name: i18n.CONFIRMED[lang],
      type: 'bar',
      data: kond.map(n => n.Confirmed).map(n => parseFloat(n.toFixed(2)))
    },
    {
      name: i18n.ACTIVE[lang],
      type: 'bar',
      data: kond.map(n => n.Active).map(n => parseFloat(n.toFixed(2)))
    },
    {
      name: i18n.RECOVERED[lang],
      type: 'bar',
      data: kond.map(n => n.Cured).map(n => parseFloat(n.toFixed(2)))
    },
    {
      name: i18n.DEATHS[lang],
      type: 'bar',
      data: kond.map(n => n.Dead).map(n => parseFloat(n.toFixed(2)))
    },
  ];

    return opts;
  }

  ngOnDestroy(): void {
    this.themeSubscription.unsubscribe();
  }
}
