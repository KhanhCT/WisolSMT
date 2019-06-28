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
        public int OrderNodeQty { get; set; }

        public OrderViewModel()
        {
            Products = PlanViewModel.Products;
            controller = new Controller();
        }
        public void OrderNode()
        {
            MainWindow.ConfirmWindow.Visibility = System.Windows.Visibility.Visible;
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
