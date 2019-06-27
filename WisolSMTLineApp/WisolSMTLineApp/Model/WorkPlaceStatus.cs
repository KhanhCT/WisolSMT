using System;

namespace WisolSMTLineApp.Model
{
    public class WorkPlaceStatus
    {
        public string StatusCode { get; set; }
        public int StatusCounter { get; set; }
        public string StatusMsg { get; set; }
        public DateTime StartTime { get; set; }
        public DateTime StopTime { get; set; }
        public bool Finished { set; get; }
    }

    public class ProductionPlan
    {
        public string WorkingDate { set; get; }
        public int FactoryID { set; get; }
        public int LineID { set; get; }
        public int ShiftID { set; get; }
        public int WorkPlaceID { set; get; }
        public int ProductID { set; get; }
        public string ProductName { set; get; }
        public int OrderedQty { set; get; }
        public DateTime StartTime { set; get; }
        public DateTime StopTime { set; get; }
    }

    public enum WorkingStatus { Normal, Order, Warning }
    public enum WorkingMode { Auto, Manual }
    public enum Shift { DAY, NIGHT }
}
