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
}
