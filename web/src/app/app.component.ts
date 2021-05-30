import { Component, OnInit, OnDestroy } from '@angular/core';
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
  isDataComplete = false;
  isError = false;
  i18n;

  urlLogo = window.location.origin + environment.baseHref + '/assets/img/logo-36.png';
  private destroy$: Subject<void> = new Subject<void>();
  private dataSubs1: Subscription;
  private dataSubs2: Subscription;
  private dataSubs3: Subscription;

  constructor(private titleSvc: Title,
              private themeSvc: NbThemeService,
              private breakpointSvc: NbMediaBreakpointsService,
              private dialogSvc: NbDialogService,
              private svc: Svc.DataService){
    this.breakpoints = this.breakpointSvc.getBreakpointsMap();

    this.themeSvc.onThemeChange().subscribe((theme: any) => {
    });

    this.dataSubs1 = this.svc.getCase$().subscribe( ([casesRaw, mapTopoRaw]) => {
      this.MapTopo = mapTopoRaw;
      this.Cases = Utils.transformData(casesRaw);
      Utils.FillTopoData(this.Cases, this.MapTopo);
      this.onSelectLocation('Nasional');
      this.LatestCase = Utils.getLatest(this.Cases, 'Nasional');
      this.isError = svc.isError;
      this.i18n = i18n;
    });

    this.dataSubs2 = this.svc.getRest$().subscribe( ([vaxRaw, catgRaw, catgProvRaw]) => {
      this.SelectedDataVax = Utils.transformDataVax(vaxRaw);
      this.HealthConditions = [...Utils.getDataCat(catgRaw), ...Utils.getDataCat(catgProvRaw)];
      this.onSelectLocation('Nasional');
    });

    this.dataSubs3 = this.svc.getHospitals$().subscribe( hospRaw => {
       this.Hospitals = Utils.GetHospitalData(hospRaw);
    });

    this.isDataComplete = !this.isError;

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

  openLocationDialog(closeOnEsc: boolean): void {
    this.dialogSvc.open(LocationPanelComponent, {
      context: {
        Locations: this.Cases.map(n => n.Location),
        SelectedLocation: this.SelectedData.Location,
        Lang: this.Lang,
      },
      closeOnEsc }).onClose.subscribe(m => m && this.onSelectLocation(m));
      // .onClose.subscribe(n => n);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.dataSubs1.unsubscribe();
    this.dataSubs2.unsubscribe();
    this.dataSubs3.unsubscribe();
  }

}
