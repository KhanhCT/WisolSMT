using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using System.Windows;
using System.Windows.Input;
using System.Windows.Media;
using System.Windows.Threading;
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
                    _WorkingStatus = value;
                    OnPropertyChanged("WorkingStatus");
                    if (_WorkingStatus == WorkingStatus.Order)
                        CreateOrder();

                }
            }
        }
        public Plan Plan
        {
            get;
            set;
        } = new Plan();
        private string _OrderDuration;
        public string OrderDuration
        {
            get { return _OrderDuration; }
            set
            {
                if (_OrderDuration != value)
                {
                    _OrderDuration = value;
                    OnPropertyChanged(nameof(OrderDuration));
                }
            }
        }
        //Timer T;

        public void CreateOrder()
        {
            var ProductionDtl = new ProductionDtl()
            {
                Amount = Setting.DefaultLots,
                FactoryID = 1,
                WorkingDate = App.TodayDate,
                ShiftID = App.CurrentShift,
                LineID = Setting.SelectedLine.LineID,
                ProductID = Setting.SelectedProduct.ID,
                Message = "WAITTING"
            };
            if (Api.Controller.CreateOrder(ProductionDtl))
            {
                //LstOrderNotFinish.Clear();
                //Api.Controller.getLstOrderNotFinish(2)?.ForEach(x => LstOrderNotFinish.Add(x));
                //MessageBox.Show("Create order successfully");
            }
            //else
            //MessageBox.Show("Create order failed, something happened");
        }

        SemaphoreSlim ConfirmOrderLock = new SemaphoreSlim(1, 1);
        public async void ConfirmOrder()
        {
            //Confirm to server
            if (ConfirmOrderLock.CurrentCount == 0)
                return;
            await ConfirmOrderLock.WaitAsync();
            if (UnConfirmOrder != null)
                if (Api.Controller.ConfirmOrder(UnConfirmOrder))
                {
                    //LstOrderNotFinish.Clear();
                    //Api.Controller.getLstOrderNotFinish(Setting.SelectedLine.LineID)?.ForEach(x => LstOrderNotFinish.Add(x));
                    MessageBox.Show("Order Confirmed", "Success", MessageBoxButton.OK, MessageBoxImage.Information);
                }
                else
                {
                    MessageBox.Show("Confirm order failed", "Failed", MessageBoxButton.OK, MessageBoxImage.Error);
                }
            ConfirmOrderLock.Release();
        }

        DispatcherTimer UITimer = new DispatcherTimer(DispatcherPriority.Background, Application.Current.Dispatcher);
        CancellationTokenSource UpdateUITaskCTS;
        public void CancelTask()
        {
            if (UpdateUITaskCTS != null)
                if (!UpdateUITaskCTS.IsCancellationRequested)
                    UpdateUITaskCTS.Cancel();
        }

        public MonitorViewModel()
        {
            CancelTask();
            UpdateUITaskCTS = new CancellationTokenSource();
            UpdateUILoop(UpdateUITaskCTS.Token);
        }

        ProductionDtl UnConfirmOrder = null;
        private async void UpdateUILoop(CancellationToken token)
        {
            try
            {
                var ProductionPlan1 = await Api.Controller.GetLinePlan(new ProductionPlan()
                {
                    FactoryID = 1,
                    WorkingDate = TodayDate,
                    ProductID = Setting.SelectedProduct.ID,
                    LineID = Setting.SelectedLine.LineID,
                    ShiftID = CurrentShift
                });
                if (ProductionPlan1 == null)
                {
                    IN.CountingSensor.OnPinValueChanged -= CountingSensor_OnPinValueChanged;
                    return;
                }
                else
                {
                    IN.CountingSensor.OnPinValueChanged += CountingSensor_OnPinValueChanged;
                }
                Plan.elapsed = ProductionPlan1.elapsed;
                Plan.remain = ProductionPlan1.remain;
                Plan.order = ProductionPlan1.order;
                while (true)
                {
                    token.ThrowIfCancellationRequested();
                    ProductionDtl LastOrder = null;
                    var Orders = await Api.Controller.getLstOrderNotFinishAsync(Setting.SelectedLine.LineID);
                    if (Orders.Count > 0)
                        LastOrder = Orders.Last();
                    if (LastOrder != null)
                    {
                        UnConfirmOrder = LastOrder;
                        OrderDuration = "Confirm";
                        if (WorkingStatus == WorkingStatus.Stop)
                            OrderDuration = $"Confirm \n{LastOrder.Message?.ToUpper()} | {(DateTime.Now - DateTime.Parse(LastOrder.StartTime)).ToString("hh\\:mm\\:ss")}";
                    }
                    else
                    {
                        OrderDuration = "No Order";
                        UnConfirmOrder = null;
                    }
                    var ProductionPlan = await Api.Controller.GetLinePlan(new ProductionPlan()
                    {
                        FactoryID = 1,
                        WorkingDate = TodayDate,
                        ProductID = Setting.SelectedProduct.ID,
                        LineID = Setting.SelectedLine.LineID,
                        ShiftID = CurrentShift
                    });
                    if (ProductionPlan != null)
                    {
                        Plan.elapsed = ProductionPlan.elapsed;
                        Plan.remain = ProductionPlan.remain;
                        Plan.order = ProductionPlan.order;
                    }
                    if (Plan.remain > 0)
                    {
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
                        if (Plan.remain > Setting.DefaultLevel)
                        {
                            Ellipse = new SolidColorBrush(Colors.Green);
                        }
                        else
                        {
                            Ellipse = new SolidColorBrush(Colors.Orange);
                        }
                    }
                    if (Plan.remain == 0)
                    {
                        WorkingStatus = WorkingStatus.Stop;
                        Ellipse = new SolidColorBrush(Colors.Red);
                        //await OUT.OrangeLight.RST();
                        //await OUT.GreenLight.RST();
                        //await OUT.RedLight.SET();
                    }
                    await Task.Delay(1000);
                }
            }
            catch (Exception)
            {

            }
        }
        SemaphoreSlim LockObject = new SemaphoreSlim(1, 1);
        private async void CountingSensor_OnPinValueChanged(object sender, GPIOPin.PinValueChangedEventArgs e)
        {
            if (e.Edge == Edge.Rise)
            {
                if (Plan.remain > 0)
                {
                    await LockObject.WaitAsync();
                    var ProductionPlan1 = await Api.Controller.GetLinePlan(new ProductionPlan()
                    {
                        FactoryID = 1,
                        WorkingDate = TodayDate,
                        ProductID = Setting.SelectedProduct.ID,
                        LineID = Setting.SelectedLine.LineID,
                        ShiftID = CurrentShift
                    });
                    if (ProductionPlan1 != null)
                    {
                        if (ProductionPlan1.remain > 0)
                            await Api.Controller.UpdatePlan(new ProductionPlan()
                            {
                                ShiftID = App.CurrentShift,
                                LineID = Setting.SelectedLine.LineID,
                                FactoryID = 1,
                                GoodProdQty = 1,
                                WorkingDate = App.TodayDate,
                                ProductID = Setting.SelectedProduct.ID
                            });
                    }
                    LockObject.Release();
                    //if (Succeed)
                    //{
                    //    Plan.remain--;
                    //    if (Plan.remain < Setting.DefaultLevel)
                    //    {
                    //        WorkingStatus = WorkingStatus.Order;
                    //        //await OUT.OrangeLight.SET();
                    //        //await OUT.GreenLight.RST();
                    //        //await OUT.RedLight.RST();
                    //    }
                    //    else if (Plan.remain > Setting.DefaultLevel)
                    //    {
                    //        WorkingStatus = WorkingStatus.Normal;
                    //        //await OUT.GreenLight.SET();
                    //        //await OUT.OrangeLight.RST();
                    //        //await OUT.RedLight.RST();
                    //    }
                    //    Plan.elapsed++;
                    //    if (Plan.remain > Setting.DefaultLevel)
                    //    {
                    //        Ellipse = new SolidColorBrush(Colors.Green);

                    //    }
                    //    else
                    //    {
                    //        Ellipse = new SolidColorBrush(Colors.Orange);
                    //    }
                    //}
                    //if (Plan.remain == 0)
                    //{
                    //    WorkingStatus = WorkingStatus.Stop;
                    //    Ellipse = new SolidColorBrush(Colors.Red);
                    //    //await OUT.OrangeLight.RST();
                    //    //await OUT.GreenLight.RST();
                    //    //await OUT.RedLight.SET();
                    //}
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


        private void SensorDetected()
        {
            CountingSensor_OnPinValueChanged(null, new GPIOPin.PinValueChangedEventArgs(Edge.Rise));
        }

        public void Dispose()
        {
            IN.CountingSensor.OnPinValueChanged -= CountingSensor_OnPinValueChanged;
            CancelTask();
        }

        public bool CanExecute
        {
            get
            {
                return true;
            }
        }

        private ICommand _ClickCommand;
        public ICommand ClickCommand
        {
            get
            {
                return _ClickCommand ?? (_ClickCommand = new CommandHandler(() => SensorDetected(), () => CanExecute));
            }
        }

        private ICommand _OrderCommand;
        public ICommand OrderCommand
        {
            get
            {
                return _OrderCommand ?? (_OrderCommand = new CommandHandler(() => ConfirmOrder(), () => CanExecute));
            }
        }
    }
}
