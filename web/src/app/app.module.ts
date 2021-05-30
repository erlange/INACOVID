import { BrowserModule, Title } from '@angular/platform-browser';
import { NgModule,  } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { NbThemeModule, NbDialogModule } from '@nebular/theme';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { NgxEchartsModule } from 'ngx-echarts';

import { DEFAULT_THEME } from './../theme.default';
import { COSMIC_THEME } from './../theme.cosmic';
import { CORPORATE_THEME } from './../theme.corporate';
import { DARK_THEME } from './../theme.dark';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { UiModule } from './ui.module';
import { MapComponent } from './maps/map.component';
import { ChartCaseComponent } from './charts/chart.case.component';
import { ChartCumComponent } from './charts/chart.total.component';
import { ChartVaxComponent } from './charts/chart.vax.component';
import { ChartTestComponent } from './charts/chart.test.component';
import { ChartCatgComponent } from './charts/chart.catg.component';
import { ChartAgeComponent } from './charts/chart.age.component';
import { ChartProvComponent } from './charts/chart.prov.component';
import { ChartHospComponent } from './charts/chart.hosp.component';
import { InfoPanelComponent } from './panels/infopanel.component';
import { SmallInfoPanelComponent } from './panels/small.infopanel.component';
import { LoadingPanelComponent } from './panels/loadingpanel.component';
import { AboutPanelComponent } from './panels/aboutpanel.component';
import { LocationPanelComponent } from './panels/locationpanel.component';
import { SafeHtmlPipe } from './data/safehtml.pipe';

import { registerLocaleData } from '@angular/common';
import localeId from '@angular/common/locales/id';
import localeEn from '@angular/common/locales/en-001';
import localeEs from '@angular/common/locales/es';
import localeFr from '@angular/common/locales/fr';
import localeZh from '@angular/common/locales/zh';

registerLocaleData(localeId);
registerLocaleData(localeEn);
registerLocaleData(localeEs);
registerLocaleData(localeFr);
registerLocaleData(localeZh);

@NgModule({
  declarations: [
    AppComponent,
    MapComponent,
    ChartCaseComponent, ChartCumComponent, ChartVaxComponent, ChartTestComponent,
    ChartCatgComponent, ChartAgeComponent, ChartProvComponent, ChartHospComponent,
    InfoPanelComponent, SmallInfoPanelComponent, LoadingPanelComponent, AboutPanelComponent, LocationPanelComponent,
    SafeHtmlPipe,
  ],
  imports: [
    NbThemeModule.forRoot({name: 'default'}),
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    UiModule,
    HttpClientModule,
    LeafletModule,
    NgxEchartsModule.forRoot({
      echarts: () => import('echarts')
    }),
    NbDialogModule.forRoot(),
  ],
  providers: [
    Title,
    NbThemeModule.forRoot(
      {
        name: 'dark',
      },
      [ DEFAULT_THEME, COSMIC_THEME, CORPORATE_THEME, DARK_THEME ],
    ).providers,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
