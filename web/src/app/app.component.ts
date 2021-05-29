import { Component, OnInit, OnDestroy } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { NbThemeService, NbMediaBreakpointsService, NbMediaBreakpoint, NbDialogService } from '@nebular/theme';
import { map, takeUntil } from 'rxjs/operators';
import { Subject, Subscription } from 'rxjs';
import { IData, IDataVax, ILatestCase, ILatestVax, IDataCategory, i18n} from './data/data.model';
import { AboutPanelComponent } from './panels/aboutpanel.component';
import * as Svc from './data/data.services';
import * as Utils from './data/data.utils';
import { environment } from 'src/environments/environment';

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
  Cases: IData[] = [] as IData[];
  HealthConditions: IDataCategory[] = [] as IDataCategory[];
  MapTopo: any;
  SelectedData: IData;
  SelectedDataVax: IDataVax;
  SelectedDataCatg: IDataCategory[];
  LatestCase: ILatestCase;
  LatestVax: ILatestVax;
  breakpoint: NbMediaBreakpoint = { name: '', width: 0 };
  breakpoints: any;
  isError = false;
  i18n;

  urlLogo = window.location.origin + environment.baseHref + '/assets/img/logo-36.png';
  private destroy$: Subject<void> = new Subject<void>();
  private dataSubs1: Subscription;
  private dataSubs2: Subscription;

  constructor(private titleSvc: Title,
              private themeSvc: NbThemeService,
              private breakpointSvc: NbMediaBreakpointsService,
              private dialogSvc: NbDialogService,
              private svc: Svc.DataService){
    this.breakpoints = this.breakpointSvc.getBreakpointsMap();

    this.themeSvc.onThemeChange().subscribe((theme: any) => {
    });

    this.dataSubs1 = this.svc.getCase$().subscribe( ([cases, mapTopo]) => {
      this.MapTopo = mapTopo;
      this.Cases = Utils.transformData(cases);
      Utils.FillTopoData(this.Cases, this.MapTopo);
      this.onSelectLocation('Nasional');
      this.LatestCase = Utils.getLatest(this.Cases, 'Nasional');
      this.isError = svc.isError;
      this.i18n = i18n;
    });

    this.dataSubs2 = this.svc.getRest$().subscribe( ([vax, catg, catgProv]) => {
      this.SelectedDataVax = Utils.transformDataVax(vax);
      this.HealthConditions = [...Utils.getDataCat(catg), ...Utils.getDataCat(catgProv)];
      this.onSelectLocation('Nasional');
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
    console.log('HealthConditions', this.HealthConditions);
    console.log('SelectedDataCatg', this.SelectedDataCatg);
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

  openDialog(closeOnEsc: boolean): void {
    this.dialogSvc.open(AboutPanelComponent, {
      context: {
        Lang: this.Lang,
      },
      closeOnEsc });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.dataSubs1.unsubscribe();
    this.dataSubs2.unsubscribe();
  }

}
