using System;
using System.Collections.Generic;
using System.Text;

namespace com.github.erlange.inacovid
{
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
