using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WisolSMTLineApp.Model
{
    public class ProductionPlan
    {
        public string WorkingDate { set; get; }
        public int FactoryID { set; get; }
        public int LineID { set; get; }
        public int ShiftID { set; get; }
        public int ProductID { set; get; }
        public string ProductName { set; get; }
        public int OrderedQty { set; get; }
        public int GoodProdQty { set; get; }
        public int NGProdQty { set; get; }
        public bool Disabled { set; get; }
    }
}
