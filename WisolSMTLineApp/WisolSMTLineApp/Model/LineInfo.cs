using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WisolSMTLineApp.Model
{
    public class LineInfo
    {
        public string LineID { get; set; }
        public int FactoryID { get; set; }
        public string LineCode { get; set; }
        public string Description { get; set; }
        public string Disabled { get; set; }
    }
}
