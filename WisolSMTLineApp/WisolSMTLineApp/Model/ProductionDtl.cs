using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WisolSMTLineApp.Model
{
    public class ProductionDtl
    {
        public int ID { set; get; }
        public string WorkingDate { set; get; }
        public int FactoryID { set; get; }
        public int LineID { set; get; }
        public int ShiftID { set; get; }
        public int ProductID { set; get; }
        public int WorkerID { set; get; }
        public String StartTime { set; get; }
        public String StopTime { set; get; }
        public bool Finished { set; get; }
    }
}
