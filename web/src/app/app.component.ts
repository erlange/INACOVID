import { Component, OnInit, OnDestroy } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { NbThemeService, NbMediaBreakpointsService, NbMediaBreakpoint, NbDialogService } from '@nebular/theme';
import { map, takeUntil } from 'rxjs/operators';
import { Subject, Subscription } from 'rxjs';
import { IData, IDataVax, ILatestCase, ILatestVax, i18n} from './data/data.model';
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
  currentTheme: string;
  Title: string;
  Cases: IData[] = [];
  MapTopo: any;
  CurrentLoc: string;
  SelectedData: IData;
  SelectedDataVax: IDataVax;
  LatestCase: ILatestCase;
  LatestVax: ILatestVax;
  breakpoint: NbMediaBreakpoint = { name: '', width: 0 };
  breakpoints: any;
  isError = false;
  i18n;

  urlLogo = window.location.origin + environment.baseHref + '/assets/img/logo-36.png';
  private destroy$: Subject<void> = new Subject<void>();
  private dataSubscription: Subscription;

  constructor(private titleSvc: Title,
              private themeSvc: NbThemeService,
              private breakpointSvc: NbMediaBreakpointsService,
              private dialogSvc: NbDialogService,
              private svc: Svc.DataService){
    this.breakpoints = this.breakpointSvc.getBreakpointsMap();

    this.themeSvc.onThemeChange().subscribe((theme: any) => {
    });

    this.dataSubscription = this.svc.getAll$().subscribe( ([cases, mapTopo, vax]) => {
      this.MapTopo = mapTopo;
      this.Cases = Utils.transformData(cases);
      Utils.FillTopoData(this.Cases, this.MapTopo);
      this.onSelectLocation('Nasional');
      this.SelectedDataVax = Utils.transformDataVax(vax);
      this.LatestCase = Utils.getLatest(this.Cases, 'Nasional');
      this.isError = svc.isError;
      this.i18n = i18n;
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
    this.dataSubscription.unsubscribe();
  }

}
