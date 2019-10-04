using SMTMornitor.Api;
using SMTMornitor.Model;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Threading;

namespace SMTMornitor.ViewModel
{
    public class LineViewModel
    {
        public List<MonitorObj> LineInfos { get; set; } = new List<MonitorObj>();
        public ApiHandler apiHandler = new ApiHandler();
        private DispatcherTimer _UpdateUITimer;

        public LineViewModel()
        {
            //initialize();
        }
        void initialize()
        {
            List<ProdLine> runningPlans = apiHandler.GetRunningPlan();
            runningPlans.ForEach(p => LineInfos.Add(new MonitorObj()
            {
                Name = p.Name,
                LineID = p.ID,
            }));
            // Create a time to update UI on real time
            _UpdateUITimer = new DispatcherTimer();
            _UpdateUITimer.Interval = TimeSpan.FromMilliseconds(3 * 1000);
            _UpdateUITimer.Tick += OnUpdateUIEventHandler;
            _UpdateUITimer.IsEnabled = true;
        }
        private void OnUpdateUIEventHandler(Object source, EventArgs e)
        {
            List<ProdLine> runningPlans = apiHandler.GetRunningPlan();
            runningPlans.ForEach(p =>
            {

            });
        }
        public void MainFormClosingListener()
        {
            if (_UpdateUITimer != null)
            {
                _UpdateUITimer.Stop();
            }
        }
    }
    public class MonitorObj : INotifyPropertyChanged
    {
        public int LineID { get; set; }
        public string Name { get; set; }
        private string _ProductName;
        public string ProductName
        {
            get { return _ProductName; }
            set
            {
                if (_ProductName != value)
                {
                    _ProductName = value;
                    NotifyPropertyChanged(nameof(ProductName));
                }
            }
        }
        int _Order;
        public int Order
        {
            get { return _Order; }
            set
            {
                if (_Order != value)
                {
                    _Order = value;
                    NotifyPropertyChanged(nameof(Order));
                }
            }
        }
        int _Elapse;
        public int Elapse
        {
            get { return _Elapse; }
            set
            {
                if (_Elapse != value)
                {
                    _Elapse = value;
                    NotifyPropertyChanged(nameof(Elapse));
                }
            }
        }
        int _Remain;
        public int Remain
        {
            get { return _Remain; }
            set
            {
                if (_Remain != value)
                {
                    _Remain = value;
                    NotifyPropertyChanged(nameof(Remain));
                }
            }
        }

        private WorkingStatus _WorkingStatus;
        public WorkingStatus WorkingStatus
        {
            get { return _WorkingStatus; }
            set
            {
                if (_WorkingStatus != value)
                {
                    _WorkingStatus = value;
                    NotifyPropertyChanged(nameof(WorkingStatus));
                }
            }
        }
        public event PropertyChangedEventHandler PropertyChanged;
        void NotifyPropertyChanged(string proName)
        {
            PropertyChanged?.Invoke(this, new PropertyChangedEventArgs(proName));
        }
    }
    public enum WorkingStatus { NORMAL, ORDED, STOP, NO_PRODUCTION }
}
