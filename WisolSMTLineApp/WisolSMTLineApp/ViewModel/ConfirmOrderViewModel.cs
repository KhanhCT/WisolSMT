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
    public class ConfirmOrderViewModel : BaseViewModel
    {
        int amount = Setting.DefaultLots;
        public int Amount
        {
            get { return amount; }
            set { amount = value; OnPropertyChanged(nameof(Amount)); }
        }
        public ObservableCollection<ProductionDtl> LstOrderNotFinish { get; set; } = new ObservableCollection<ProductionDtl>();
        public ConfirmOrderViewModel()
        {
            //LstOrderNotFinish = new ObservableCollection<ProductionDtl>() { new ProductionDtl() { Amount = 100, ProductID = 0 } };
            Api.Controller.getLstOrderNotFinish(1).ForEach(x => LstOrderNotFinish.Add(x));
        }

        public void ConfirmOrder(object b)
        {
            object lockObject = new object();
            //Confirm to server
            var ProductionDtl = (ProductionDtl)b;
            lock (lockObject)
            {
                if (Api.Controller.ConfirmOrder(ProductionDtl))
                {
                    Setting.RemainNode += ProductionDtl.Amount;
                }
                else
                {
                    MessageBox.Show("Confirm order failed");
                }

            }
        }

        public void SubmitOrder()
        {
            var ProductionDtl = new ProductionDtl() { Amount = Amount, WorkingDate = App.TodayDate, ShiftID = App.CurrentShift, LineID = 2 };
            if (Api.Controller.CreateOrder(ProductionDtl))
            {
                LstOrderNotFinish.Clear();
                Api.Controller.getLstOrderNotFinish(1).ForEach(x => LstOrderNotFinish.Add(x));
                MessageBox.Show("Create order successfully");
            }
            else
                MessageBox.Show("Create order failed, something happened");
        }

        private ICommand _submitCommand;
        public ICommand SubmitCommand
        {
            get
            {
                return _submitCommand ?? (_submitCommand = new CommandHandler(() => SubmitOrder(), () => CanExecute));
            }
        }

        private ICommand _clickCommand;
        public ICommand ClickCommand
        {
            get
            {
                return _clickCommand ?? (_clickCommand = new CommandHandler((p) => ConfirmOrder(p), () => CanExecute));
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
