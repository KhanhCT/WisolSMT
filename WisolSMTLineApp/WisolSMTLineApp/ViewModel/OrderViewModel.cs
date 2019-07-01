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
    public class OrderViewModel : BaseViewModel
    {
        public Controller controller;
        public ObservableCollection<Product> Products { get; private set; }
        int _Amount;
        public int Amount
        {
            get { return _Amount; }
            set { _Amount = value; OnPropertyChanged(nameof(Amount)); }
        }
        public OrderViewModel()
        {
            Amount = Setting.DefaultLots;
            Products = PlanViewModel.Products;
            controller = new Controller();
        }
        public void OrderNode()
        {
            //controller.CreateOrder(new ProductionDtl()
            //{
            //    LineID = 1,
            //    FactoryID = 1,
            //    Amount = Amount,
            //    WorkingDate = App.TodayDate,
            //    ShiftID = App.CurrentShift,

            //}); 
            MainWindow.ConfirmWindow = new ConfirmationWindow();
            MainWindow.ConfirmWindow.ShowDialog();
        }

        private ICommand _orderCommand;
        public ICommand OrderCommand
        {
            get
            {
                return _orderCommand ?? (_orderCommand = new CommandHandler(() => OrderNode(), () => CanExecute));
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
