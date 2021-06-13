import { Component, OnInit, OnDestroy } from '@angular/core';
import { formatDate } from '@angular/common';
import { Title } from '@angular/platform-browser';
import { NbThemeService, NbMediaBreakpointsService, NbMediaBreakpoint, NbDialogService } from '@nebular/theme';
import { map, takeUntil } from 'rxjs/operators';
import { Subject, Subscription } from 'rxjs';
import { IData, IDataVax, ILatestCase, ILatestVax, IDataCategory, i18n, IHospital} from './data/data.model';
import { AboutPanelComponent } from './panels/aboutpanel.component';
import * as Svc from './data/data.services';
import * as Utils from './data/data.utils';
import { environment } from 'src/environments/environment';
import { LocationPanelComponent } from './panels/locationpanel.component';

@Component({
  providers: [Svc.DataService],
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: []
})


export class AppComponent implements OnInit, OnDestroy {
  Lang = 'id';
  Title: string;
  currentTheme: string;
  CurrentLoc: string;
  MapTopo: any;
  SelectedData: IData;
  SelectedDataVax: IDataVax;
  LatestCase: ILatestCase;
  LatestVax: ILatestVax;
  Cases: IData[] = [] as IData[];
  HealthConditions: IDataCategory[] = [] as IDataCategory[];
  SelectedDataCatg: IDataCategory[];
  Hospitals: IHospital[] = [] as IHospital[];
  breakpoint: NbMediaBreakpoint = { name: '', width: 0 };
  breakpoints: any;
  isError = false;
  i18n;
  private LatestUpd: Date;

  urlLogo = window.location.origin + environment.baseHref + '/assets/img/logo-36.png';
  private destroy$: Subject<void> = new Subject<void>();
  private caseSubs: Subscription;
  private vaxSubs: Subscription;
  private hospSubs: Subscription;
  private catgSubs: Subscription;
  private latestUpdSubs: Subscription;

  constructor(private titleSvc: Title,
              private themeSvc: NbThemeService,
              private breakpointSvc: NbMediaBreakpointsService,
              private dialogSvc: NbDialogService,
              private svc: Svc.DataService){

    this.breakpoints = this.breakpointSvc.getBreakpointsMap();

    this.themeSvc.onThemeChange().subscribe((theme: any) => {
    });

    this.caseSubs = this.svc.getCase$().subscribe( ([casesRaw, mapTopoRaw]) => {
      this.MapTopo = mapTopoRaw;
      this.Cases = Utils.transformData(casesRaw);
      Utils.FillTopoData(this.Cases, this.MapTopo);
      this.onSelectLocation('Nasional');
      this.LatestCase = Utils.getLatest(this.Cases, 'Nasional');
      this.i18n = i18n;
    }, err => {
      this.isError = true;
    });

    this.vaxSubs = this.svc.getVax$().subscribe( vaxRaw => {
      this.SelectedDataVax = Utils.transformDataVax(vaxRaw);
      this.onSelectLocation('Nasional');
    });

    this.catgSubs = this.svc.getCatg$().subscribe( ([ catgRaw, catgProvRaw]) => {
      this.HealthConditions = [...Utils.getDataCat(catgRaw), ...Utils.getDataCat(catgProvRaw)];
      this.onSelectLocation('Nasional');
    });

    this.hospSubs = this.svc.getHospitals$().subscribe( hospRaw => {
       this.Hospitals = Utils.GetHospitalData(hospRaw);
    });

    this.latestUpdSubs = this.svc.getLatestUpd$().subscribe( raw => {
      this.LatestUpd = new Date(Date.parse (raw[0].commit.committer.date));
    });
  }

  ngOnInit(): void {
    const { xl } = this.breakpointSvc.getBreakpointsMap();
    console.log('xl', xl);
    this.themeSvc.onMediaQueryChange()
      .pipe(
        map(([, currentBreakpoint]) => currentBreakpoint.width < xl),
        takeUntil(this.destroy$),
      )
      .subscribe();

    this.themeSvc.onThemeChange()
      .pipe(
        map(({ name }) => name),
        takeUntil(this.destroy$),
      )
      .subscribe(themeName => this.currentTheme = themeName);
      // .subscribe(themeName => this.currentTheme = themeName);
    this.changeTheme('cosmic');
    this.Title = i18n.TITLE[this.Lang];
    this.titleSvc.setTitle(i18n.TITLE[this.Lang]);

  }

  onSelectLocation(input: string): void{
    this.CurrentLoc = input;
    this.SelectedData = this.Cases.find(f => f.Location.toLowerCase().trim() === input.toLowerCase().trim());
    this.SelectedDataCatg = this.HealthConditions.filter(n => n.Location.toLocaleLowerCase().trim() === input.toLowerCase().trim());
  }

  changeLang(locale: string): void {
    this.Lang = locale;
    this.Title = i18n.TITLE[this.Lang];
    this.titleSvc.setTitle(i18n.TITLE[this.Lang]);
  }

  changeTheme(theme: string): void {
    this.themeSvc.changeTheme(theme);
    this.currentTheme = theme;
  }

  openAboutDialog(closeOnEsc: boolean): void {
    this.dialogSvc.open(AboutPanelComponent, {
      context: {
        Lang: this.Lang,
      },
      closeOnEsc });
  }

  reload(): void {
    location.reload();
  }

  openLocationDialog(closeOnEsc: boolean): void {
    this.dialogSvc.open(LocationPanelComponent, {
      context: {
        Locations: this.Cases.map(n => n.Location),
        SelectedLocation: this.SelectedData.Location,
        Lang: this.Lang,
      },
      closeOnEsc }).onClose.subscribe(m => m && this.onSelectLocation(m));
  }

  getLatestUpdate(): string {
    if (this.LatestUpd){
      return i18n.LATEST_UPDATE[this.Lang] + ': ' + formatDate(this.LatestUpd, 'long', this.Lang );
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.caseSubs.unsubscribe();
    this.vaxSubs.unsubscribe();
    this.catgSubs.unsubscribe();
    this.hospSubs.unsubscribe();
    this.latestUpdSubs.unsubscribe();
  }
}
