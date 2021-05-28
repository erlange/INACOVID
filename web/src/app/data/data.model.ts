export interface ICase {
  CaseDate: string ;
  CaseCount: number;
  }

export interface IData {
  Location: string;
  Confirmed: ICase[];
  Cured: ICase[];
  Dead: ICase[];
  ConfirmedCum: ICase[];
  CuredCum: ICase[];
  DeadCum: ICase[];
  MapBounds: L.LatLngBoundsExpression;
}

export interface IDataVax {
  SpecPcrTcm: ICase[];
  SpecPcrTcmCum: ICase[];
  SpecAntigen: ICase[];
  SpecAntigenCum: ICase[];
  PplPcrTcm: ICase[];
  PplPcrTcmCum: ICase[];
  PplAntigen: ICase[];
  PplAntigenCum: ICase[];
  Dose1: ICase[];
  Dose1Cum: ICase[];
  Dose2: ICase[];
  Dose2Cum: ICase[];
}

export interface ILatestCase{
  LatestDate: string;
  Confirmed: number;
  Dead: number;
  Cured: number;
  ConfirmedCum: number;
  DeadCum: number;
  CuredCum: number;
  Active: number;
  ActiveCum: number;
}

export interface ILatestVax{
  LatestDate: string;
  SpecPcrTcm: number;
  SpecPcrTcmCum: number;
  SpecAntigen: number;
  SpecAntigenCum: number;
  PplPcrTcm: number;
  PplPcrTcmCum: number;
  PplAntigen: number;
  PplAntigenCum: number;
  Dose1: number;
  Dose1Cum: number;
  Dose2: number;
  Dose2Cum: number;
}

export interface IChartType{
  Value: string;
  DisplayText: string;
}

export const i18n = {
  LANGUAGE: {
    en: 'English',
    es: 'Español',
    fr: 'Français',
    zh: '中文',
    id: 'Bahasa',
  },
  COVID19: {
    en: 'COVID-19 Coronavirus Map',
    es: 'Mapa COVID-19',
    fr: 'Carte du Coronavirus-19',
    zh: '新型冠状病毒肺炎疫情图',
    id: 'Peta Sebaran COVID-19',
  },
  INDONESIA: {
    en: 'Indonesia',
    es: 'Indonesia',
    fr: 'Indonésie',
    zh: '印度尼西亚',
    id: 'Indonesia',
  },
  CASES: {
    en: 'Cases',
    es: 'Casos',
    fr: 'Cas',
    zh: '病例',
    id: 'Kasus',
  },
  ALL_CASES: {
    en: 'All Cases',
    es: 'Todos los casos',
    fr: 'Tous les cas',
    zh: '病例',
    id: 'Seluruh Kasus',
  },
  NEWCASE: {
    en: 'New',
    es: 'Nuevos',
    fr: 'Nouveaux',
    zh: '新增',
    id: 'Kasus Baru',
  },
  CONFIRMED: {
    en: 'Confirmed',
    es: 'Confirmados',
    fr: 'Confirmés',
    zh: '确诊',
    id: 'Terkonfirmasi',
  },
  DEATHS: {
    en: 'Deaths',
    es: 'Muertes',
    fr: 'Morts',
    zh: '死亡',
    id: 'Meninggal',
  },
  RECOVERED: {
    en: 'Recovered',
    es: 'Recuperados',
    fr: 'Soignés',
    zh: '治愈',
    id: 'Sembuh',
  },
  ACTIVE: {
    en: 'Active',
    es: 'Activos',
    fr: 'Actifs',
    zh: '现存确诊',
    id: 'Aktif',
  },
  NEW_CONFIRMED: {
    en: 'New Confirmed',
    es: 'Confirmados Nuevos',
    fr: 'Nouveaux Confirmés',
    zh: '新增确诊',
    id: 'Terkonfirmasi Baru',
  },
  NEW_DEATHS: {
    en: 'New Deaths',
    es: 'Muertes Nuevas',
    fr: 'Morts Nouvelles',
    zh: '新增死亡',
    id: 'Kasus Meninggal Baru',
  },
  CUMULATIVE: {
    en: 'Total',
    es: 'Total',
    fr: 'Total',
    zh: '累积',
    id: 'Kumulatif',
  },
  CUMULATIVE_CASES: {
    en: 'Cumulative Cases',
    es: 'Total',
    fr: 'Total',
    zh: '累积',
    id: 'Kasus Kumulatif',
  },
  DAILY: {
    en: 'Daily',
    es: 'Diario',
    fr: 'Journalier',
    zh: '新增',
    id: 'Kasus Harian',
  },
  DAILY_CASES: {
    en: 'Daily Cases',
    es: 'Diario',
    fr: 'Journalier',
    zh: '新增',
    id: 'Kasus Harian',
  },
  PERCENT: {
    en: 'Percent',
    es: 'Porcentage',
    fr: 'Pourcentage',
    zh: '百分比',
    id: 'Persentase',
  },
  DATE_FORMAT_MEDIUM: {
    en: 'MMM d, yyyy',
    es: 'dd/MMM/yyyy',
    fr: 'dd/MMM/yyyy',
    zh: 'yyyy年M月d日',
    id: 'dd/MMM/yyyy',
  },
  DATE_FORMAT_LONG: {
    en: 'MMMM d, yyyy',
    es: 'dd/MMMM/yyyy',
    fr: 'dd/MMMM/yyyy',
    zh: 'yyyy年M月d日',
    id: 'dd-MMMM-yyyy',
  },
  MOVING_AVERAGE_7: {
    en: '7-day Average',
    es: 'Media móvil de 7 días ',
    fr: 'Moyenne mobile sur 7 jours)',
    zh: '7移动平均'  ,
    id: 'Rata-rata 7 hari',
  },
  FATALITY_RECOVERY_RATE: {
    en: 'Fatality/Recovery Rate',
    es: 'Mortalidad/Tasa de Recupero',
    fr: 'Mortalité/Taux de Rémission',
    zh: '病死率/治愈率',
    id: 'Laju Kematian/Kesembuhan',
  },
  FATALITY_RATE: {
    en: 'Fatality Rate',
    es: 'Tasa de Mortalidad',
    fr: 'Taux de Mortalité',
    zh: '病死率',
    id: 'Laju Kematian',
  },
  RECOVERY_RATE: {
    en: 'Recovery Rate',
    es: 'Tasa de Recuperados',
    fr: 'Taux de Rémission',
    zh: '治愈率',
    id: 'Laju Kesembuhan',
  },
  GROWTH_RATE: {
    en: 'Growth Rate',
    es: 'Tasa de crecimiento',
    fr: 'Taux de croissance',
    zh: '增长率',
    id: 'Laju Pertumbuhan',
  },
  DOUBLING_TIME: {
    en: 'Case Doubling Time',
    es: 'Tiempo en Duplicarse',
    fr: 'Temps de Duplication',
    zh: '病例倍增时间', 
    id: 'Penggandaan Waktu',
  },
  ESTIMATED_R0: {
    en: 'Estimated R₀',
    es: 'R₀ Estimado',
    fr: 'R₀ Estimé',
    zh: 'R₀估值',
    id: 'Estimasi R₀',
  },
  TESTED_SPECIMEN: {
    en: 'Specimens Tested',
    es: 'Muestras probadas',
    fr: 'Échantillons testés',
    zh: '标本测试',
    id: 'Jumlah Spesimen Diperiksa',
  },
  TESTED_SPECIMEN_PCR: {
    en: 'Specimens Tested (PCR)',
    es: 'Muestras probadas (PCR)',
    fr: 'Échantillons testés (PCR)',
    zh: '标本测试 (PCR)',
    id: 'Spesimen Diperiksa (PCR)',
  },
  TESTED_SPECIMEN_ANTIGEN: {
    en: 'Specimens Tested (Antigen)',
    es: 'Muestras probadas (Antígeno)',
    fr: 'Échantillons testés (Antigène)',
    zh: '标本测试（抗原）',
    id: 'Spesimen Diperiksa (Antigen)',
  },
  TESTED_PEOPLE: {
    en: 'People Tested',
    es: 'Personas probadas',
    fr: 'Personnes testées',
    zh: '经过测试的人',
    id: 'Jumlah Pasien Diperiksa',
  },
  TESTED_PEOPLE_PCR: {
    en: 'People Tested (PCR)',
    es: 'Personas probadas (PCR)',
    fr: 'Personnes testées (PCR)',
    zh: '经过测试的人 (PCR)',
    id: 'Pasien Diperiksa (PCR)',
  },
  TESTED_PEOPLE_ANTIGEN: {
    en: 'People Tested (Antigen)',
    es: 'Personas probadas (Antígeno)',
    fr: 'Personnes testées (Antigène)',
    zh: '经过测试的人 (抗原）',
    id: 'Pasien Diperiksa (Antigen)',
  },
  TESTED_SPECIMEN_PEOPLE: {
    en: 'Specimens/People Tested',
    es: 'Muestras / Personas probadas',
    fr: 'Échantillons / personnes testées',
    zh: '标本/人测试',
    id: 'Jumlah Spesimen/Pasien Diperiksa',
  },
  VAX_DOSE: {
    en: 'Vaccine Doses',
    es: 'Dosis de vacunas ',
    fr: 'Doses de vaccin',
    zh: '疫苗剂量',
    id: 'Jumlah Penerima Vaksinasi',
  },
  VAX_DOSE1: {
    en: '1st Dose',
    es: '1ra Dosis ',
    fr: '1ère dose',
    zh: '第一次剂量',
    id: 'Vaksinasi Ke-1',
  },
  VAX_DOSE2: {
    en: '2nd Dose',
    es: '2da Dosis',
    fr: '2e dose',
    zh: '第二名',
    id: 'Vaksinasi Ke-2',
  },
  TITLE: {
    en: 'Indonesia COVID-19',
    es: 'COVID-19 de Indonesia',
    fr: 'Covid-19 de l\'Indonésie',
    zh: 'COVID-19印尼个案',
    id: 'COVID-19 Indonesia',
  },
  ABOUT_TEXT: {
    en: 'The data are gathered from <a href="https://data.covid19.go.id/public/index.html" target="_blank">BNPB</a>.  Logo and icons are from  <a href="https://icons8.com" target="_blank">Icons8</a> and <a href="https://fontawesome.com/" target="_blank">Font Awesome</a>, developed with <a href="https://angular.io/" target="_blank">Angular</a> framework.  This project is <a href="https://github.com/erlange/INACOVID" target="_blank">open-sourced on Github</a>. ',
    es: 'Los datos se recopilan de <a href="https://data.covid19.go.id/public/index.html" target="_blank"> BNPB </a>. El logotipo y los iconos son de <a href="https://icons8.com" target="_blank"> Icons8 </a> y <a href="https://fontawesome.com/" target="_blank"> Font Awesome </a>, desarrollado con el marco <a href="https://angular.io/" target="_blank"> Angular </a>. Este proyecto es <a href="https://github.com/erlange/INACOVID" target="_blank"> código abierto en Github </a>.',
    fr: 'Les données sont collectées à partir du <a href="https://data.covid19.go.id/public/index.html" target="_blank"> BNPB </a>. Le logo et les icônes proviennent de <a href="https://icons8.com" target="_blank"> Icons8 </a> et de <a href="https://fontawesome.com/" target="_blank"> Font Awesome </a>, développé avec le framework <a href="https://angular.io/" target="_blank"> Angular </a>. Ce projet est <a href="https://github.com/erlange/INACOVID" target="_blank"> open-source sur Github </a>.',
    zh: '数据是从<a href="https://data.covid19.go.id/public/index.html" target="_blank"> BNPB </a>收集的。 徽标和图标来自<a href="https://icons8.com" target="_blank"> Icons8 </a>和<a href="https://fontawesome.com/" target="_blank"> Font Awesome</a>，它是使用<a href="https://angular.io/" target="_blank"> Angular </a>框架开发的。 该项目是<a href="https://github.com/erlange/INACOVID" target="_blank">在Github上开源</a>。',
    id: 'Data dikumpulkan dari <a href="https://data.covid19.go.id/public/index.html" target="_blank"> BNPB </a>. Logo dan ikon diambil dari <a href="https://icons8.com" target="_blank"> Icons8 </a> dan <a href="https://fontawesome.com/" target="_blank"> Font Awesome </a>, dibuat dengan <a href="https://angular.io/" target="_blank"> Angular </a>. Project ini bersifat open source dengan lisensi MIT.  Source code ada di <a href="https://github.com/erlange/INACOVID" target="_blank">Github Repository</a>.'
  }
};

export function GetChartTypes(lang: string): IChartType[] {
  return [
    {DisplayText: i18n.CONFIRMED[lang], Value: 'CONFIRMED'},
    {DisplayText: i18n.DEATHS[lang], Value: 'DEATHS'},
    {DisplayText: i18n.RECOVERED[lang], Value: 'RECOVERED'},
    {DisplayText: i18n.ACTIVE[lang], Value: 'ACTIVE'},
    {DisplayText: i18n.ALL_CASES[lang], Value: 'ALL_CASES'},
  ];
}

export function GetChartCumTypes(lang: string): IChartType[] {
  return [
    {DisplayText: i18n.ALL_CASES[lang], Value: 'ALL_CASES'},
    {DisplayText: i18n.FATALITY_RECOVERY_RATE[lang], Value: 'FATALITY_RECOVERY_RATE'},
    {DisplayText: i18n.GROWTH_RATE[lang], Value: 'GROWTH_RATE'},
    {DisplayText: i18n.DOUBLING_TIME[lang], Value: 'DOUBLING_TIME'},
    {DisplayText: i18n.ESTIMATED_R0[lang], Value: 'ESTIMATED_R0'},
  ];
}

export function GetTestChartTypes(lang: string): IChartType[] {
  return [
    {DisplayText: i18n.TESTED_PEOPLE[lang], Value: 'TESTED_PEOPLE'},
    {DisplayText: i18n.TESTED_SPECIMEN[lang], Value: 'TESTED_SPECIMEN'},
  ];
}

export function GetVaxChartTypes(lang: string): IChartType[] {
  return [
    {DisplayText: i18n.VAX_DOSE1[lang], Value: 'VAX_DOSE1'},
    {DisplayText: i18n.VAX_DOSE2[lang], Value: 'VAX_DOSE2'},
  ];
}
