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

export interface IDataCategory {
  Location: string;
  Category: string;
  Subcategory: string;
  Confirmed: number;
  Active: number;
  Cured: number;
  Dead: number;
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

export interface IChartType {
  Value: string;
  DisplayText: string;
}

export interface IHospital {
  Name: string;
  Capacity: number;
  Lat: number;
  Lng: number;
  Address: string;
  Type: string;
  Region: string;
  Province: string;
}

export interface IHospitalBed {
  Province: string;
  Capacity: number;
}

export const HospitalRaw = {
  address: 'alamat',
  capacity: 'tempat_tidur',
  lat: 'lat',
  lng: 'lon',
  province: 'propinsi',
  region: 'wilayah',
  type: 'tipe'
};

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
  TOTAL: {
    en: 'Total',
    es: 'Total',
    fr: 'Total',
    zh: '全部的',
    id: 'Total',
  },
  CUMULATIVE: {
    en: 'Cumulative',
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
    id: 'Harian',
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
    id: 'Waktu Penggandaan',
  },
  GROWTH_RATE_PCT: {
    en: 'Growth Rate (%)',
    es: 'Tasa de crecimiento (%)',
    fr: 'Taux de croissance (%)',
    zh: '增长率 (%)',
    id: 'Laju Pertumbuhan (%)',
  },
  DOUBLING_TIME_DAY: {
    en: 'Doubling Time (day)',
    es: 'Tiempo en Duplicarse (día)',
    fr: 'Temps de Duplication (jour)',
    zh: '倍增时间（天）',
    id: 'Waktu Penggandaan (hari)',
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
  PCR: {
    en: 'PCR',
    es: 'PCR',
    fr: 'PCR',
    zh: 'PCR',
    id: 'PCR',
  },
  ANTIGEN: {
    en: 'Antigen',
    es: 'Antígeno',
    fr: 'Antigène',
    zh: '抗原',
    id: 'Antigen',
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
  HEALTH_CONDITIONS: {
    en: 'Symptoms and Comorbidities',
    es: 'Síntomas y comorbilidades',
    fr: 'Symptômes et comorbidités',
    zh: '症状和合并症',
    id: 'Gejala dan Penyakit Penyerta',
  },
  COMORBIDITIES: {
    en: 'Comorbidities',
    es: 'Comorbilidades',
    fr: 'Comorbidités',
    zh: '合并症',
    id: 'Penyakit Penyerta',
  },
  SYMPTOMS: {
    en: 'Symptoms',
    es: 'Síntomas',
    fr: 'Symptômes',
    zh: '症状',
    id: 'Gejala',
  },
  AGE_GENDER: {
    en: 'Age Group and Gender',
    es: 'Grupo de edad y género',
    fr: 'Groupe d\'âge et sexe',
    zh: '年龄段和性别',
    id: 'Usia dan Jenis Kelamin',
  },
  AGE: {
    en: 'Age Group',
    es: 'Grupo de edad',
    fr: 'Groupe d\'âge',
    zh: '年龄阶层',
    id: 'Kelompok Usia',
  },
  GENDER: {
    en: 'Gender',
    es: 'Género',
    fr: 'Sexe',
    zh: '性别',
    id: 'Jenis Kelamin',
  },
  BY_PROVINCES: {
    en: 'Provincial Cases',
    es: 'Casos provinciales',
    fr: 'Cas provinciaux',
    zh: '省级案例',
    id: 'Kasus per Propinsi',
  },
  HOSPITAL_BEDDING_CAPACITY: {
    en: 'Hospital Bedding Capacities',
    es: 'Capacidades de ropa de cama de hospital',
    fr: 'Capacités de literie d\'hôpital',
    zh: '医院床上用品容量',
    id: 'Kapasitas RS',
  },
  BEDDING_NUM: {
    en: 'Count of Beds',
    es: 'Número de camas',
    fr: 'Nombre de lits',
    zh: '床数',
    id: 'Jumlah Tempat Tidur RS',
  },

  TITLE: {
    en: 'Indonesia COVID-19',
    es: 'COVID-19 de Indonesia',
    fr: 'Covid-19 de l\'Indonésie',
    zh: 'COVID-19印尼个案',
    id: 'COVID-19 Indonesia',
  },
  LOC_OPT_TITLE: {
    en: 'Choose a Province',
    es: 'Choose a Province',
    fr: 'Choisir une province',
    zh: 'Choose a Province',
    id: 'Pilih Propinsi',
  },

  ABOUT_TEXT: {
    en: 'The data are gathered from <a href="https://data.covid19.go.id/public/index.html" target="_blank">BNPB</a>.  Designs, logos and icons are from  <a href="https://akveo.github.io/nebular/" target="_blank">Nebular</a>, <a href="https://icons8.com" target="_blank">Icons8</a> and <a href="https://fontawesome.com/" target="_blank">Font Awesome</a>, developed with <a href="https://angular.io/" target="_blank">Angular</a> framework.  This project is made by <a href="https://github.com/erlange/" target="_blank">me</a> and  <a href="https://github.com/erlange/INACOVID" target="_blank">open-sourced on Github</a>.  ',
    es: 'Los datos se recopilan de <a href="https://data.covid19.go.id/public/index.html" target="_blank"> BNPB </a>. Los diseños, logotipos e íconos son de <a href="https://akveo.github.io/nebular/" target="_blank"> Nebular </a>, <a href = "https://icons8.com" target = "_ blank"> Icons8 </a> y <a href="https://fontawesome.com/" target="_blank"> Font Awesome </a>, desarrollado con <a href = "https: // angular.io/ "target =" _ blank "> marco angular </a>. Este proyecto está hecho por <a href="https://github.com/erlange/" target="_blank"> yo </a> y <a href = "https://github.com/erlange/INACOVID" target = "_ blank"> código abierto en Github </a>.',
    fr: 'Les données sont collectées à partir du <a href="https://data.covid19.go.id/public/index.html" target="_blank"> BNPB </a>. Les dessins, logos et icônes proviennent de <a href="https://akveo.github.io/nebular/" target="_blank"> Nebular </a>, <a href = "https://icons8.com" target = "_ blank"> Icons8 </a> et <a href="https://fontawesome.com/" target="_blank"> Font Awesome </a>, développés avec <a href = "https: // angular.io/ "target =" _ blank "> Cadre angulaire </a>. Ce projet est réalisé par <a href="https://github.com/erlange/" target="_blank"> moi </a> et <a href = "https://github.com/erlange/INACOVID" target = "_ blank"> open-source sur Github </a>.',
    zh: '数据是从<a href="https://data.covid19.go.id/public/index.html" target="_blank"> BNPB </a>收集的。 设计，徽标和图标来自<a href="https://akveo.github.io/nebular/" target="_blank">星云</a>，<a href =“ https://icons8.com” target =“ _ blank”> Icons8 </a>和<a href="https://fontawesome.com/" target="_blank"> Font Awesome </a>（由<a href =“ https：//开发） angular.io/“ target =” _ blank“> Angular </a>框架。 该项目由<a href="https://github.com/erlange/" target="_blank">我</a>和<a href =“ https://github.com/erlange/INACOVID”制作 target =“ _ blank”>在Github上开源</a>。',
    id: 'Data dikumpulkan dari <a href="https://data.covid19.go.id/public/index.html" target="_blank"> BNPB </a>. Desain, logo, dan ikon berasal dari <a href="https://akveo.github.io/nebular/" target="_blank"> Nebular </a>, <a href = "https://icons8.com" target = "_ blank"> Icons8 </a> dan <a href="https://fontawesome.com/" target="_blank"> Font Awesome </a>, dikembangkan dengan <a href = "https: // angular.io/ "target =" _ blank "> Angular </a>. Proyek ini dibuat oleh <a href="https://github.com/erlange/" target="_blank"> saya </a> dan <a href = "https://github.com/erlange/INACOVID" target = "_ blank"> bersifat open-source di Github </a>.'
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

export function GetCatgChartTypes(lang: string): IChartType[] {
  return [
    {DisplayText: i18n.SYMPTOMS[lang], Value: 'gejala'},
    {DisplayText: i18n.COMORBIDITIES[lang], Value: 'kondisi_penyerta'},
  ];
}
export function GetAgeChartTypes(lang: string): IChartType[] {
  return [
    {DisplayText: i18n.AGE[lang], Value: 'kelompok_umur'},
    {DisplayText: i18n.GENDER[lang], Value: 'jenis_kelamin'},
  ];
}

export function GetVaxTestChartTypes(lang: string): IChartType[] {
  return [
    {DisplayText: i18n.DAILY[lang], Value: 'DAILY'},
    {DisplayText: i18n.CUMULATIVE[lang], Value: 'CUMULATIVE'},
    {DisplayText: i18n.GROWTH_RATE[lang], Value: 'GROWTH_RATE'},
    {DisplayText: i18n.DOUBLING_TIME[lang], Value: 'DOUBLING_TIME'},
    ];
}

