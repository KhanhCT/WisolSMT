using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using System.Windows;
using System.Windows.Data;
using System.Windows.Input;
using System.Windows.Threading;
using WisolSMTLineApp.Model;

namespace WisolSMTLineApp.ViewModel
{
    public class PlanViewModel : BaseViewModel
    {
        public static PlanViewModel PlanVM;
        public ObservableCollection<Shift> Shifts { get; private set; } = new ObservableCollection<Shift>();
        public Shift SelectedShift { get; set; }
        public static ObservableCollection<Product> Products { get; private set; } = new ObservableCollection<Product>();
        public Product SelectedProduct
        {
            get;
            set;
        }

        public int RemainNodes { get; set; }
        public Controller controller;
        static ShiftPeriod DayShift = new ShiftPeriod() { From = TimeSpan.Parse("08:00:00") };
        static ShiftPeriod NightShift = new ShiftPeriod() { From = TimeSpan.Parse("20:00:00") };
        static TimeSpan TodayDateTime { get { return TimeSpan.Parse(DateTime.Now.ToString("hh:mm:ss")); } }

        DateTime _SelectedDate = DateTime.Now;
        public DateTime SelectedDate
        {
            get { return _SelectedDate; }
            set
            {
                _SelectedDate = value;
                OnPropertyChanged("SelectedDate");
            }
        }
        public static int CurrentShift
        {
            get
            {
                //TimeSpan NowTimeStamp = TimeSpan.Parse(DateTime.Now.ToString("hh:mm:ss"));
                if (TodayDateTime >= DayShift.From && TodayDateTime < DayShift.To)
                    return 1;
                else
                    return 2;
            }
        }
        object lockObject = new object();
        public PlanViewModel()
        {
            PlanVM = this;
            Initilize();

        }
        public async void Initilize()
        {
            List<Shift> _shifts = null;
            List<Product> _products = null;
            try
            {
                await Task.Run(() =>
                {
                    controller = new Controller();
                    _shifts = controller.GetShifts();
                    _products = controller.GetProducts();
                });
            }
            catch (Exception)
            {

            }
            finally
            {
                if (_shifts != null)
                {
                    _shifts.ForEach(x => { Shifts.Add(x); });
                    SelectedShift = (App.CurrentShift == 1) ? Shifts[0] : Shifts[1];
                }
                if (_products != null)
                {
                    _products.ForEach(x => Products.Add(x));
                    SelectedProduct = Products[0];
                }
            }
        }
        public void Create_Plan()
        {
            if (
            controller.NewProductionPlan(new ProductionPlan()
            {
                ProductID = SelectedProduct.ID,
                ProductName = SelectedProduct.Product_Name,
                FactoryID = 1,
                LineID = 1,
                WorkingDate = SelectedDate.ToString("dd/mm/yyyy"),
                OrderedQty = RemainNodes,
                ShiftID = SelectedShift.ID,
            })) { MessageBox.Show("Plan created"); }
            else
            {
                MessageBox.Show("Plan create failed, something happened");
            }
        }

        private ICommand _clickCommand;
        public ICommand ClickCommand
        {
            get
            {
                return _clickCommand ?? (_clickCommand = new CommandHandler(() => Create_Plan(), () => CanExecute));
            }
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
