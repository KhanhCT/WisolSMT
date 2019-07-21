using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows;
using System.Windows.Input;
using WisolSMTLineApp.Model;

namespace WisolSMTLineApp.ViewModel
{
    public class OrderViewModel : BaseViewModel
    {
        public ObservableCollection<Product> Products { get; private set; }
        public Product SelectedProduct
        {
            get;
            set;
        }

        int _Amount;
        public int Amount
        {
            get { return _Amount; }
            set { _Amount = value; OnPropertyChanged(nameof(Amount)); }
        }
        public OrderViewModel()
        {
            Amount = Setting.DefaultLots;
            SelectedProduct = Setting.SelectedProduct;
        }

        public void CreateOrder()
        {
            var ProductionDtl = new ProductionDtl()
            {
                Amount = Amount,
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
                MessageBox.Show("Create order successfully");
            }
            else
                MessageBox.Show("Create order failed, something happened");
        }
        private ICommand _orderCommand;
        public ICommand OrderCommand
        {
            get
            {
                return _orderCommand ?? (_orderCommand = new CommandHandler(() => CreateOrder(), () => CanExecute));
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
