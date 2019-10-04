using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Input;

namespace SMTMornitor.ViewModel
{
    public class MainViewModel : BaseViewModel
    {
        #region commands
        public ICommand OpenLineMonitorCommand { get; set; }
        #endregion
        public MainViewModel()
        {
            OpenLineMonitorCommand = new RelayCommand<UserControl>((p) =>
            {
                return true;
            }, (p) =>
            {
                LineMonitor lineMonitor = new LineMonitor();
                lineMonitor.Show();
            });
        }
    }
}
