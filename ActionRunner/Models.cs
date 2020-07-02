using System;
using System.Collections.Generic;
using System.Text;

namespace com.github.erlange.inacovid
{
    public class CsvField
    {
        public string Location { get; set; }
        public DateTime Date { get; set; }
        public int Confirmed { get; set; }
        public int Cured { get; set; }
        public int Deaths { get; set; }

    }
    public class CsvFieldExt
    {
        public string Location { get; set; }
        public DateTime Date { get; set; }
        public int DiConfirmed { get; set; }
        public int DiCured { get; set; }
        public int DiDeaths { get; set; }
        public int DiHosp { get; set; }
        public int Confirmed { get; set; }
        public int Cured { get; set; }
        public int Deaths { get; set; }
        public int Hosp { get; set; }

    }

    public class CsvFieldCat
    {
        public string Location { get; set; }
        public DateTime Date { get; set; }
        public string Category { get; set; }
        public string SubCategory { get; set; }
        public double? Confirmed { get; set; }
        public double? Cured { get; set; }
        public double? Deaths { get; set; }
        public double? Hosp { get; set; }
    }
    public class CsvFieldArcGis
    {
        public string Location { get; set; }
        public DateTime Date { get; set; }
        public int? DiConfirmed { get; set; }
        public int? DiCured { get; set; }
        public int? DiDeaths { get; set; }
        public int? DiHosp { get; set; }
        public int? Confirmed { get; set; }
        public int? Cured { get; set; }
        public int? Deaths { get; set; }
        public int? Hosp { get; set; }
        public double? PctCured { get; set; }
        public double? PctDead { get; set; }
        public double? PctHosp { get; set; }
        public int? SpecTotal { get; set; }
        public int? SpecConfirmed { get; set; }
        public int? SpecNeg { get; set; }
        public int? TracObserved { get; set; }
        public int? TracMonitored { get; set; }

    }

    public class Hospital
    {
        public string nama { get; set; }
        public string kode_rs { get; set; }
        public int? tempat_tidur { get; set; }
        public string telepon { get; set; }
        public double? lat { get; set; }
        public double? lon { get; set; }
        public string alamat { get; set; }
        public string tipe { get; set; }
        public string wilayah { get; set; }
        public string propinsi { get; set; }
    }

}
