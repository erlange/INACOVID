import * as Model from './data.model';
import * as t from 'topojson-client';

export function transformData(data: any): Model.IData[] {
  const target: Model.IData[] = [];
  Object.entries(data).map(([k, v]) => {
    target.push({Location: k,
    Confirmed:  Object.entries(Object.entries(v)
      .find(([m, ]) => m === 'Confirmed')[1])
      .map(([kk, vv]) => ( {CaseDate: kk , CaseCount: vv })) as Model.ICase[],
    Cured: Object.entries(Object.entries(v)
      .find(([m, ]) => m === 'Cured')[1])
      .map(([kk, vv]) => ( {CaseDate: kk , CaseCount: vv })) as Model.ICase[],
    Dead: Object.entries(Object.entries(v)
      .find(([m, ]) => m === 'Dead')[1])
      .map(([kk, vv]) => ( {CaseDate: kk , CaseCount: vv })) as Model.ICase[],
    ConfirmedCum:  Object.entries(Object.entries(v)
      .find(([m, ]) => m === 'Confirmed_T')[1])
      .map(([kk, vv]) => ( {CaseDate: kk , CaseCount: vv })) as Model.ICase[],
    CuredCum: Object.entries(Object.entries(v)
      .find(([m, ]) => m === 'Cured_T')[1])
      .map(([kk, vv]) => ( {CaseDate: kk , CaseCount: vv })) as Model.ICase[],
    DeadCum: Object.entries(Object.entries(v)
      .find(([m, ]) => m === 'Dead_T')[1])
      .map(([kk, vv]) => ( {CaseDate: kk , CaseCount: vv} )) as Model.ICase[],
      MapBounds: [],
    });
  });
  return target;
}

export function transformDataVax(data: any): Model.IDataVax {
  const target = {} as Model.IDataVax;
  target.SpecPcrTcm = Object.entries(Object.entries(data)
    .find(([n, ]) => n === 'jumlah_spesimen_pcr_tcm')[1])
    .map(([j, k]) =>  ({CaseDate: j, CaseCount: k })).slice(1);
  target.SpecPcrTcmCum = Object.entries(Object.entries(data)
    .find(([n, ]) => n === 'jumlah_spesimen_pcr_tcm_kum')[1])
    .map(([j, k]) =>  ({CaseDate: j, CaseCount: k })).slice(1);
  target.SpecAntigen = Object.entries(Object.entries(data)
    .find(([n, ]) => n === 'jumlah_spesimen_antigen')[1])
    .map(([j, k]) =>  ({CaseDate: j, CaseCount: k })).slice(1);
  target.SpecAntigenCum = Object.entries(Object.entries(data)
    .find(([n, ]) => n === 'jumlah_spesimen_antigen_kum')[1])
    .map(([j, k]) =>  ({CaseDate: j, CaseCount: k })).slice(1);
  target.PplPcrTcm = Object.entries(Object.entries(data)
    .find(([n, ]) => n === 'jumlah_orang_pcr_tcm')[1])
    .map(([j, k]) =>  ({CaseDate: j, CaseCount: k })).slice(1);
  target.PplPcrTcmCum = Object.entries(Object.entries(data)
    .find(([n, ]) => n === 'jumlah_orang_pcr_tcm_kum')[1])
    .map(([j, k]) =>  ({CaseDate: j, CaseCount: k })).slice(1);
  target.PplAntigen = Object.entries(Object.entries(data)
    .find(([n, ]) => n === 'jumlah_orang_antigen')[1])
    .map(([j, k]) =>  ({CaseDate: j, CaseCount: k })).slice(1);
  target.PplAntigenCum = Object.entries(Object.entries(data)
    .find(([n, ]) => n === 'jumlah_orang_antigen_kum')[1])
    .map(([j, k]) =>  ({CaseDate: j, CaseCount: k })).slice(1);
  target.Dose1 = Object.entries(Object.entries(data)
    .find(([n, ]) => n === 'jumlah_vaksinasi_1')[1])
    .map(([j, k]) =>  ({CaseDate: j, CaseCount: k })).slice(1);
  target.Dose1Cum = Object.entries(Object.entries(data)
    .find(([n, ]) => n === 'jumlah_jumlah_vaksinasi_1_kum')[1])
    .map(([j, k]) =>  ({CaseDate: j, CaseCount: k })).slice(1);
  target.Dose2 = Object.entries(Object.entries(data)
    .find(([n, ]) => n === 'jumlah_vaksinasi_2')[1])
    .map(([j, k]) =>  ({CaseDate: j, CaseCount: k })).slice(1);
  target.Dose2Cum = Object.entries(Object.entries(data)
    .find(([n, ]) => n === 'jumlah_jumlah_vaksinasi_2_kum')[1])
    .map(([j, k]) =>  ({CaseDate: j, CaseCount: k })).slice(1);

  return target;
}


export function FillTopoData(caseData: Model.IData[], json): void {
  const mapFeatures: any = t.feature(json, json.objects.IDN_adm1);
  mapFeatures.features.forEach(n => {
    if (n.properties.NAME_1 === 'Irian Jaya Barat') {n.properties.NAME_1 = 'Papua Barat'; }
    if (n.properties.NAME_1 === 'Bangka-Belitung') {n.properties.NAME_1 = 'Kepulauan Bangka Belitung'; }
    if (n.properties.NAME_1 === 'Jakarta Raya') {n.properties.NAME_1 = 'DKI Jakarta'; }
    if (n.properties.NAME_1 === 'Yogyakarta') {n.properties.NAME_1 = 'Daerah Istimewa Yogyakarta'; }

    const found = caseData.find(c => c.Location.toLowerCase() === n.properties.NAME_1.toLowerCase());
    if (found){
      n.properties.CONFIRMEDCUM = found.ConfirmedCum[found.ConfirmedCum.length - 1].CaseCount;
      n.properties.CUREDCUM = found.CuredCum[found.CuredCum.length - 1].CaseCount;
      n.properties.DEADCUM = found.DeadCum[found.DeadCum.length - 1].CaseCount;
      n.properties.CONFIRMED = found.Confirmed[found.Confirmed.length - 1].CaseCount;
      n.properties.CURED = found.Cured[found.Cured.length - 1].CaseCount;
      n.properties.DEAD = found.Dead[found.Dead.length - 1].CaseCount;
      n.properties.LATESTDATE = found.ConfirmedCum[found.ConfirmedCum.length - 1].CaseDate;
    }
  });
}

export function getLatest(caseData: Model.IData[], loc: string): Model.ILatestCase {
  const result = {} as Model.ILatestCase;
  const selectedData: Model.IData = caseData.find(m => m.Location === loc);
  const latest = selectedData.ConfirmedCum.length - 1;
  const prev = latest - 1;

  result.LatestDate = selectedData.ConfirmedCum[latest].CaseDate;
  result.Confirmed = selectedData.Confirmed[latest].CaseCount;
  result.Cured = selectedData.Cured[latest].CaseCount;
  result.Dead = selectedData.Dead[latest].CaseCount;
  result.ConfirmedCum = selectedData.ConfirmedCum[latest].CaseCount;
  result.CuredCum = selectedData.CuredCum[latest].CaseCount;
  result.DeadCum = selectedData.DeadCum[latest].CaseCount;
  result.ActiveCum = result.ConfirmedCum - result.CuredCum - result.DeadCum;
  result.Active = result.ActiveCum
                - (selectedData.ConfirmedCum[prev].CaseCount
                  - selectedData.CuredCum[prev].CaseCount
                  - selectedData.DeadCum[prev].CaseCount);

  return result;
}


// https://stackoverflow.com/questions/19981713/html5-js-chart-with-moving-average#63348486
export function movingAvg(array: Array<number>, countBefore: number, countAfter: number): number[] {
  if (countAfter === undefined) {countAfter = 0; }
  const result: number[] = [];
  for (let i = 0; i < array.length; i++) {
    const subArr = array.slice(Math.max(i - countBefore, 0), Math.min(i + countAfter + 1, array.length));
    const avg = subArr.reduce((a, b) => a + (isNaN(b) ? 0 : b), 0) / subArr.length;
    result.push(avg);
  }
  return result;
}

export function getColor(d: number): string {
  return d > 300000 ? '#800026' :
        d > 200000 ? '#bd0026' :
        d > 100000 ? '#e31a1c' :
        d > 50000 ? '#FC4E2A' :
        d > 25000 ? '#FD8D3C' :
        d > 12500 ? '#FEB24C' :
        d > 10000 ? '#FED976' :
        '#ffeda0';
}

export function getColor2(d: number): string {
  return d > 300000 ? '#67001f' :
        d > 200000 ? '#980043' :
        d > 100000 ? '#ce1256' :
        d > 50000 ? '#e7298a' :
        d > 25000 ? '#df65b0' :
        d > 12500 ? '#c994c7' :
        d > 10000 ? '#d4b9da' :
        d > 5000 ? '#e7e1ef' :
        '#f7f4f9';
}

export function decodeHtml(html: string): HTMLDivElement  {
  const txt = document.createElement('div');
  txt.innerHTML = html;
  return txt;
}
