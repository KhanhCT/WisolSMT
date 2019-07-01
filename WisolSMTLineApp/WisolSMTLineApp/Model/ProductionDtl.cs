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
        public int FactoryID { set; get; } = 1;
        public int LineID { set; get; } = 1;
        public int ShiftID { set; get; }
        public int ProductID { set; get; }
        public int Amount { get; set; }
        public bool Finished { set; get; }
    }
    //WorkingDate : params.date,
    //  FactoryID : 1,
    //  LineID : params.lineId,
    //  ShiftID : params.shiftId, 
    //  Amount : params.amount,
    //  Finished : false
}
