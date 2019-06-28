using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Input;
using WisolSMTLineApp.Model;

namespace WisolSMTLineApp.ViewModel
{
    public class PlanViewModel : BaseViewModel
    {
        public static PlanViewModel PlanVM;
        public ObservableCollection<Shift> Shifts { get; private set; }
        public Shift SelectedShift { get; set; }
        public static ObservableCollection<Product> Products { get; private set; }
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
                    return 0;
                else
                    return 1;
            }
        }
        public PlanViewModel()
        {
            PlanVM = this;
            Initilize();
        }
        public void Initilize()
        {

            //Shifts = new ObservableCollection<Shift>();
            //Products = new ObservableCollection<Product>();
            try
            {
                controller = new Controller();
                List<Shift> _shifts = controller.GetShifts();
                if (_shifts != null)
                    Shifts = new ObservableCollection<Shift>(_shifts);
            }
            catch (Exception)
            {

            }

            try
            {
                List<Product> _products = controller.GetProducts();
                if (_products != null)
                    Products = new ObservableCollection<Product>(_products);
                //foreach (Product _product in _products)
                //{
                //    Products.Add(_product);
                //}
            }
            catch (Exception)
            {

            }
        }
        public void Create_Plan()
        {
            controller.NewProductionPlan(new ProductionPlan()
            {
                ProductID = SelectedProduct.ProductID,
                ProductName = SelectedProduct.ProductName,
                FactoryID = 1,
                LineID = 1,
                WorkingDate = SelectedDate.ToString("dd/mm/yyyy"),
                OrderedQty = RemainNodes,
                ShiftID = SelectedShift.ShiftID,
            });
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
