import {Component, EventEmitter, Input, OnDestroy, Output, OnInit, NgZone, ViewChild, ElementRef, OnChanges} from '@angular/core';
import * as L from 'leaflet';
import * as t from 'topojson-client';
import * as Model from './../data/data.model';
import * as Utils from './../data/data.utils';
import { Feature, } from 'geojson';
import { formatNumber } from '@angular/common';

@Component({
  selector: 'app-map3',
  styleUrls: ['map.component.scss'],
  template: `
    <nb-card [accent]="Accent">
      <nb-card-header>
        {{this.CurrentLoc}}
        <span style="float:right">
          <button nbButton status="primary" size="tiny" class="btn btn-sm btn-info"  (click)="resetZoom()" >Reset Zoom</button>
        </span>
      </nb-card-header>
      <nb-card-body>
        <div  *ngIf="LatestCase && Lang && CurrentLoc !== 'Nasional'" class="container-fluid ">
          <div class="row">
            <div class="col-3" style="padding-right: 5px;padding-left: 5px;text-align: center;">
              <app-info-panel-sm
                Accent="primary"
                [CaseTitle]="i18n.CONFIRMED[Lang] | uppercase"
                [TotalNum]="LatestCase.ConfirmedCum"
                [Lang]="Lang">
              </app-info-panel-sm>
            </div>
            <div class="col-3" style="padding-right: 5px; padding-left: 5px; text-align: center;">
              <app-info-panel-sm
                Accent="primary"
                [CaseTitle]="i18n.ACTIVE[Lang] | uppercase"
                [TotalNum]="LatestCase.ActiveCum"
                [Lang]="Lang">
              </app-info-panel-sm>
            </div>
            <div class="col-3" style="padding-right: 5px; padding-left: 5px; text-align: center;">
              <app-info-panel-sm
                Accent="primary"
                [CaseTitle]="i18n.RECOVERED[Lang] | uppercase"
                [TotalNum]="LatestCase.CuredCum"
                [Lang]="Lang">
              </app-info-panel-sm>
            </div>
            <div class="col-3" style="padding-right: 5px; padding-left: 5px; text-align: center;">
              <app-info-panel-sm
                Accent="primary"
                [CaseTitle]="i18n.DEATHS[Lang] | uppercase"
                [TotalNum]="LatestCase.DeadCum"
                [Lang]="Lang">
              </app-info-panel-sm>
            </div>
          </div>
        </div>

        <div #tooltip style="visibility:hidden;" class="detail"></div>
          <div
            leaflet
            [leafletOptions]="options"
            [leafletLayers]="layers"
            (leafletMapReady)="mapReady($event)"
            style="height: 328px;overflow:hidden; background:transparent"
          ></div>
      </nb-card-body>
    </nb-card>
  `
})
export class MapComponent implements OnDestroy, OnInit, OnChanges {
  @Input() Accent: string;
  @Input() Lang: string;
  @Input() topo: any;
  @Input() caseData: Model.IData[];
  @Input() LatestCase: Model.ILatestCase;
  @Input() CurrentLoc: string;
  @Output() selectedLocation: EventEmitter<string> = new EventEmitter();
  @ViewChild('tooltip') tooltip: ElementRef<HTMLDivElement>;
  i18n;

  private initialBounds: L.LatLngBounds;
  private map: L.Map;

  layers = [];
  currentTheme: any;

  selectedCountry: string;

  options = {
    layers: [
      L.tileLayer('', { maxZoom: 18, attribution: '...' })
    ],
    zoomSnap: 0,
    zoomDelta: 0.5,
    zoom: 3,
    minZoom: 3,
    zoomControl: false,
    center: L.latLng(0.7893, 113.9213),
    maxBoundsViscosity: 1.0
  };

  constructor(private zone: NgZone) {
  }

  ngOnChanges(): void {
    if (this.map){
      this.setLocationBounds(this.CurrentLoc);
    }
  }

  ngOnInit(): void {
    this.layers = [this.createTopoLayer(this.topo)];
    this.i18n = Model.i18n;
  }

  mapReady(map: L.Map): void {
    this.map = map;
    map.addControl(L.control.zoom({ position: 'bottomright' }));
    map.fitBounds(this.initialBounds);
    const b = map.setMinZoom(3).getBounds();
    map.setMaxBounds(b);

    // fix the map fully displaying, existing leaflet bag
    setTimeout(() => {
      map.invalidateSize();
    }, 0);
  }

  private setLocationBounds(location: string): void{
    console.log('location', location);
    this.map.fitBounds( this.caseData.find(f => f.Location.toLowerCase() === location.toLowerCase()).MapBounds );
    if (this.caseData && this.Lang && location.toLowerCase() !== 'nasional' ) {
      this.LatestCase = Utils.getLatest(this.caseData, location.toUpperCase());
    }

  }

  private createTopoLayer(topojson: any): L.GeoJSON {
    const mapFeatures: Feature = t.feature(topojson, topojson.objects.IDN_adm1);
    const geoJSON: L.GeoJSON = L.geoJSON(mapFeatures, {
      style: feature => ({
        weight: 1,
        opacity: 1,
        shadow: 10,
        color: '#565656',
        // dashArray: '3',
        className: 'back',
        fillOpacity: 1,
        fillColor: Utils.getColor2(feature.properties.CONFIRMEDCUM)
      }),
      onEachFeature: (feature: Feature, layer: L.FeatureGroup) => {
        this.onEachFeature(feature, layer);
        const loc = this.caseData.filter(f => f.Location.toLowerCase() === feature.properties.NAME_1.toLowerCase());
        if (loc.length !== 0) {
          loc[0]
            .MapBounds = layer.getBounds();
        }
        layer.bindTooltip('<div></div>', {sticky: true});
      }
    });

    this.initialBounds = geoJSON.getBounds();
    if (this.caseData.filter(d => d.Location === 'Nasional').length === 1) {
      this.caseData.filter(
        d => d.Location === 'Nasional'
      )[0].MapBounds = this.initialBounds;
    }
    return geoJSON;
  }




  private onEachFeature(feature: Feature, layer: L.FeatureGroup): void {

    // this.zone.run(() => {

      layer.on('click', (e: L.LeafletMouseEvent) => {
        // zone tells Angular for change detection from 3rd party components
        this.zone.run(() => {
          const featureLayer = e.target;
          layer.getTooltip().unbindTooltip();
          this.map.flyToBounds(featureLayer.getBounds());
          this.selectedLocation.emit(featureLayer.feature.properties.NAME_1);
        }); // this.zone.run(() => {
      });

      layer.on('mouseout', (e) => {
        // this.zone.run(() => {
          this.tooltip.nativeElement.style.visibility = 'hidden';
          layer.setStyle({className: 'back', weight: 1, fillColor: Utils.getColor2(feature.properties.CONFIRMEDCUM) });
        // }); // this.zone.run(() => {

      });

      layer.on('mousemove', (e: L.LeafletMouseEvent) => {
        // this.zone.run(() => {

          if (e){
            const label = `
              <b>${e.target.feature.properties.NAME_1}</b><br />
              ${Model.i18n.CONFIRMED[this.Lang]}:
              <span style="float: right">
                ${ formatNumber(e.target.feature.properties.CONFIRMEDCUM, this.Lang) }
              </span><br />
              ${Model.i18n.RECOVERED[this.Lang]}:
              <span style="float: right">
                ${ formatNumber(e.target.feature.properties.CUREDCUM, this.Lang) }
              </span><br />
              ${Model.i18n.DEATHS[this.Lang]}:
              <span style="float: right">
                ${ formatNumber(e.target.feature.properties.DEADCUM, this.Lang) }
              </span>
            `;

            // const tooltipX = e.originalEvent.clientX - e.originalEvent.pageX + e.originalEvent.layerX;
            // const tooltipY = e.originalEvent.clientY - e.originalEvent.pageY + e.originalEvent.layerY;

            const tooltipX = e.originalEvent.offsetX + 20;
            const tooltipY = e.originalEvent.offsetY + 20;

            const tooltip: HTMLDivElement = this.tooltip.nativeElement;
            const style: CSSStyleDeclaration = tooltip.style;

            this.tooltip.nativeElement.className = 'detail';
            style.position = 'absolute';
            style.backgroundColor = '#303030';
            style.color = '#eee';
            style.padding = '5px';

            this.tooltip.nativeElement.innerHTML = label;

            layer.setStyle( {className: 'detail', weight: 2, fillColor: Utils.getColor(feature.properties.CONFIRMEDCUM)  });

            layer.getTooltip().options.sticky = true;
            const tt: HTMLElement = layer.getTooltip().getElement();
            tt.innerHTML = label;
            tt.style.backgroundColor = '#303030';
            tt.style.color = '#eee';
            tt.style.minWidth = '180px';
            tt.style.fontSize = '1rem';
            tt.style.wordWrap = 'break-word';

          }
          if (!L.Browser.ie && !L.Browser.opera12 && !L.Browser.edge) {
            // e.bringToFront();
          }

        // }); // this.zone.run(() => {
      });
    // }); // this.zone.run(() => {
  }


  ngOnDestroy(): void {
  }

  resetZoom(): void{
    this.map.fitBounds(this.initialBounds);
    this.selectedLocation.emit('Nasional');
  }
}
