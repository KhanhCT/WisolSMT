using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows;
using System.Windows.Input;

namespace WisolSMTLineApp.ViewModel
{
    public class ConfirmOrderViewModel : BaseViewModel
    {
        int oderedNodeQty = Setting.DefaultLots;
        public int OderedNodeQty
        {
            get
            {
                return oderedNodeQty;
            }
            set
            {
                oderedNodeQty = value;
                OnPropertyChanged("OderedNodeQty");
            }
        }

        public void ConfirmOrder()
        {
            object lockObject = new object();
            //Confirm to server
            lock (lockObject)
            {
                Api.Controller.ConfirmOrder(new Model.ProductionDtl() { FactoryID = 1, });
                Setting.OrderedNode += OderedNodeQty;
                Setting.RemainNode += OderedNodeQty;
                MainWindow.ConfirmWindow.Visibility = Visibility.Hidden;
            }
        }

        private ICommand _clickCommand;
        public ICommand ClickCommand
        {
            get
            {
                return _clickCommand ?? (_clickCommand = new CommandHandler(() => ConfirmOrder(), () => CanExecute));
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
