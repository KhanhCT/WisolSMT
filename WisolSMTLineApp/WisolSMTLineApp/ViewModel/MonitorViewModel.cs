using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
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
                    _WorkingStatus = value;
                    OnPropertyChanged("WorkingStatus");
                    if (_WorkingStatus == WorkingStatus.Order)
                        CreateOrder();
                }
            }
        }
        public Plan PlanView
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

        public async void CreateOrder()
        {
            var Orders = await Api.Controller.getLstOrderNotFinishAsync(Setting.SelectedLine.ID);
            if (Orders != null)
            {
                if (Orders.Count > 0)
                {
                    return;
                }
            }
            var ProductionDtl = new ProductionDtl()
            {
                Amount = Setting.DefaultLots,
                Factory_ID = 1,
                Working_Date = App.TodayDate,
                Shift_ID = App.CurrentShift,
                Line_ID = Setting.SelectedLine.ID,
                Product_ID = Setting.SelectedProduct.ID,
                Message = "waiting"
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
            try
            {
                if (UnconfirmOrder != null)
                {
                    if (WorkingStatus == WorkingStatus.Stop)
                        UnconfirmOrder.Duration = Duration.TotalSeconds.ToString();
                    if (Api.Controller.ConfirmOrder(UnconfirmOrder))
                    {
                        var Plans = Api.Controller.GetProductionPlan(Setting.SelectedLine.ID);
                        if (Plans != null)
                        {
                            if (Plans.Count > 0)
                            {
                                var Plan = Plans[0];
                                Plan.Remain_Qty += UnconfirmOrder.Amount;
                                Plan.Ordered_Qty += UnconfirmOrder.Amount;
                                await Api.Controller.UpdatePlan(Plan);
                            }
                        }
                        MessageBox.Show("Order Confirmed", "Success", MessageBoxButton.OK, MessageBoxImage.Information);
                    }
                    else
                    {
                        MessageBox.Show("Confirm order failed", "Failed", MessageBoxButton.OK, MessageBoxImage.Error);
                    }
                }
            }
            catch (Exception)
            {

            }
            finally
            {
                ConfirmOrderLock.Release();
            }
        }

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

        ProductionDtl UnconfirmOrder = null;
        DateTime StartTime = DateTime.Now;
        TimeSpan Duration;
        private async void UpdateUILoop(CancellationToken token)
        {
            try
            {
                //var ProductionPlan1 = await Api.Controller.GetLinePlan(new ProductionPlan()
                //{
                //    Factory_ID = 1,
                //    Working_Date = TodayDate,
                //    Product_ID = Setting.SelectedProduct.ID,
                //    Line_ID = Setting.SelectedLine.ID,
                //    Shift_ID = CurrentShift
                //});
                var Plans = Api.Controller.GetProductionPlan(Setting.SelectedLine.ID)
                .Where(x => x.Is_Active == true).ToList();
                if (Plans == null)
                {
                    IN.CountingSensor.OnPinValueChanged -= CountingSensor_OnPinValueChanged;
                    return;
                }
                else
                {
                    IN.CountingSensor.OnPinValueChanged += CountingSensor_OnPinValueChanged;
                }

                while (true)
                {
                    token.ThrowIfCancellationRequested();
                    ProductionDtl LastOrder = null;
                    var Orders = await Api.Controller.getLstOrderNotFinishAsync(Setting.SelectedLine.ID);
                    if (Orders != null)
                        if (Orders.Count > 0)
                            LastOrder = Orders.Last();
                    if (LastOrder != null)
                    {
                        UnconfirmOrder = LastOrder;
                        OrderDuration = "Confirm";
                        if (WorkingStatus == WorkingStatus.Stop)
                        {
                            Duration = DateTime.Now - StartTime;
                            OrderDuration = $"Confirm \n{LastOrder.Message?.ToUpper()} | {Duration.ToString("hh\\:mm\\:ss")}";
                        }
                        else
                        {
                            StartTime = DateTime.Now;
                        }
                    }
                    else
                    {
                        OrderDuration = "No Order";
                        UnconfirmOrder = null;
                    }
                    //var ProductionPlan = Api.Controller.GetProductionPlan(Setting.SelectedLine.ID);
                    //var ProductionPlan = await Api.Controller.GetProductionPlan(new ProductionPlan()
                    //{
                    //    Factory_ID = 1,
                    //    Working_Date = TodayDate,
                    //    Product_ID = Setting.SelectedProduct.ID,
                    //    Line_ID = Setting.SelectedLine.ID,
                    //    Shift_ID = CurrentShift
                    //});
                    Plans = Api.Controller.GetProductionPlan(Setting.SelectedLine.ID)
                    .Where(x => x.Is_Active == true).ToList();

                    if (Plans != null)
                    {
                        var Plan = Plans[0];
                        //if (Plan.Remain_Qty > 0)
                        //{
                        PlanView.elapsed = Plan.Good_Prod_Qty;
                        PlanView.remain = Plan.Remain_Qty;
                        PlanView.order = Plan.Ordered_Qty;
                        //}

                        if (PlanView.remain > 0)
                        {
                            if (PlanView.remain < Setting.DefaultLevel)
                            {
                                WorkingStatus = WorkingStatus.Order;

                            }
                            else if (PlanView.remain > Setting.DefaultLevel)
                            {
                                WorkingStatus = WorkingStatus.Normal;

                            }
                            if (PlanView.remain > Setting.DefaultLevel)
                            {
                                Ellipse = new SolidColorBrush(Colors.Green);
                            }
                            else
                            {
                                Ellipse = new SolidColorBrush(Colors.Orange);
                            }
                        }
                        if (PlanView.remain == 0)
                        {
                            WorkingStatus = WorkingStatus.Stop;
                            Ellipse = new SolidColorBrush(Colors.Red);

                        }
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
                await LockObject.WaitAsync();
                if (PlanView.remain > 0)
                {
                    var Plans = Api.Controller.GetProductionPlan(Setting.SelectedLine.ID)
                                          .Where(x => x.Is_Active == true).ToList();
                    if (Plans != null)
                    {
                        int count = Plans.Count;
                        var Plan = Plans[count - 1];
                        if (Plan.Remain_Qty > 0)
                            await Api.Controller.UpdatePlan(new ProductionPlan()
                            {
                                Shift_ID = App.CurrentShift,
                                Line_ID = Setting.SelectedLine.ID,
                                Factory_ID = 1,
                                Good_Prod_Qty = Plan.Good_Prod_Qty++,
                                Ordered_Qty = Plan.Ordered_Qty++,
                                Remain_Qty = Plan.Remain_Qty--,
                                Working_Date = TodayDate,
                                Product_ID = Setting.SelectedProduct.ID
                            });
                    }
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
                LockObject.Release();
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
