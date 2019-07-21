using System;
using System.Linq;
using System.Threading;
using System.Windows;
using System.Windows.Input;
using System.Windows.Media;
using WisolSMTLineApp.Model;
using static PandaApp.GPIOCommunication.GPIOHelper;
using static WisolSMTLineApp.App;

namespace WisolSMTLineApp.ViewModel
{
    public class MonitorViewModel : BaseViewModel, IDisposable
    {
        static WorkingStatus _WorkingStatus;
        public WorkingStatus WorkingStatus
        {
            get { return _WorkingStatus; }
            set
            {
                if (_WorkingStatus != value)
                {

                    OnPropertyChanged("WorkingStatus");
                    if (_WorkingStatus == WorkingStatus.Normal)
                        if (value == WorkingStatus.Order)
                            CreateOrder();
                    _WorkingStatus = value;
                }
            }
        }
        public Plan Plan
        {
            get;
            set;
        } = new Plan();
        public string OrderDuration
        {
            get { return _OrderDuration; }
            set { _OrderDuration = value; OnPropertyChanged(nameof(OrderDuration)); }
        }
        Timer T;
        private void CreateOrder()
        {
            if (Setting.WorkingMode == WorkingMode.Auto)
            {
                var Success = Api.Controller.CreateOrder(new ProductionDtl()
                {
                    FactoryID = 1,
                    Amount = Setting.DefaultLots,
                    LineID = Setting.SelectedLine.LineID,
                    WorkingDate = TodayDate,
                    ShiftID = CurrentShift
                });
            }
        }

        public MonitorViewModel()
        {
            var ProductionPlan = Api.Controller.GetLinePlan(new ProductionPlan()
            {
                FactoryID = 1,
                WorkingDate = TodayDate,
                ProductID = Setting.SelectedProduct.ID,
                LineID = Setting.SelectedLine.LineID,
                ShiftID = CurrentShift
            });
            if (ProductionPlan == null)
            {
                IN.CountingSensor.OnPinValueChanged -= CountingSensor_OnPinValueChanged;
                //MessageBox.Show("No plan found, Create a new plan");
                return;
            }
            else
            {
                T = new Timer(Callback, null, 0, 1000);
                IN.CountingSensor.OnPinValueChanged += CountingSensor_OnPinValueChanged;
            }
            Plan.elapsed = ProductionPlan.elapsed;
            Plan.remain = ProductionPlan.remain;
            Plan.order = ProductionPlan.order;
        }

        private void Callback(object state)
        {
            try
            {
                ProductionDtl LastOrder = null;
                var Orders = Api.Controller.getLstOrderNotFinish(Setting.SelectedLine.LineID);
                if (Orders.Count > 0)
                    LastOrder = Orders.Last();
                if (LastOrder != null)
                {
                    if (LastOrder.Message?.ToUpper() != "OK")
                        OrderDuration = $"{LastOrder.Message?.ToUpper()} | {(DateTime.Now - DateTime.Parse(LastOrder.StartTime)).ToString("hh\\:mm\\:ss")}";
                    else if (LastOrder.Message?.ToUpper() == "OK")
                    {
                        OrderDuration = "OK";
                    }
                }
            }
            catch (Exception)
            {

            }
        }

        private async void CountingSensor_OnPinValueChanged(object sender, GPIOPin.PinValueChangedEventArgs e)
        {
            if (e.Edge == Edge.Rise)
            {

                if (Plan.remain > 0)
                {
                    var Succeed = await Api.Controller.UpdatePlan(new ProductionPlan()
                    {
                        ShiftID = App.CurrentShift,
                        LineID = Setting.SelectedLine.LineID,
                        FactoryID = 1,
                        GoodProdQty = 1,
                        WorkingDate = App.TodayDate,
                        ProductID = Setting.SelectedProduct.ID
                    });
                    if (Succeed)
                    {
                        Plan.remain--;
                        if (Plan.remain < Setting.DefaultLevel)
                        {
                            WorkingStatus = WorkingStatus.Order;
                            //await OUT.OrangeLight.SET();
                            //await OUT.GreenLight.RST();
                            //await OUT.RedLight.RST();
                        }
                        else if (Plan.remain > Setting.DefaultLevel)
                        {
                            WorkingStatus = WorkingStatus.Normal;
                            //await OUT.GreenLight.SET();
                            //await OUT.OrangeLight.RST();
                            //await OUT.RedLight.RST();
                        }
                        Plan.elapsed++;
                        if (Plan.remain > Setting.DefaultLevel)
                        {
                            Ellipse = new SolidColorBrush(Colors.Green);

                        }
                        else
                        {
                            Ellipse = new SolidColorBrush(Colors.Orange);
                        }
                    }
                }
                else if (Plan.remain == 0)
                {
                    WorkingStatus = WorkingStatus.Stop;
                    Ellipse = new SolidColorBrush(Colors.Red);
                    //await OUT.OrangeLight.RST();
                    //await OUT.GreenLight.RST();
                    //await OUT.RedLight.SET();
                }
            }
        }
        SolidColorBrush _Ellipse = new SolidColorBrush(Colors.Green);
        public SolidColorBrush Ellipse
        {
            get { return _Ellipse; }
            set
            {
                _Ellipse = value; OnPropertyChanged(nameof(Ellipse));
            }
        }
        private ICommand _ClickCommand;
        private string _OrderDuration;

        public ICommand ClickCommand
        {
            get
            {
                return _ClickCommand ?? (_ClickCommand = new CommandHandler(() => SensorDetected(), () => CanExecute));
            }
        }

        private void SensorDetected()
        {
            CountingSensor_OnPinValueChanged(null, new GPIOPin.PinValueChangedEventArgs(Edge.Rise));
        }

        public void Dispose()
        {
            IN.CountingSensor.OnPinValueChanged -= CountingSensor_OnPinValueChanged;
            if (T != null) T.Dispose();
        }

        public bool CanExecute
        {
            get
            {
                return true;
            }
        }
    }
}
