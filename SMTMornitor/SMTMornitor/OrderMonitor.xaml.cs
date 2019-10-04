using SMTMornitor.ViewModel;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Data;
using System.Windows.Documents;
using System.Windows.Input;
using System.Windows.Media;
using System.Windows.Media.Imaging;
using System.Windows.Navigation;
using System.Windows.Shapes;

namespace SMTMornitor
{
    /// <summary>
    /// Interaction logic for OrderMonitor.xaml
    /// </summary>
    public partial class OrderMonitor : UserControl
    {
        public OrderMonitor()
        {
            InitializeComponent();
            OrderViewModel OrderModel = new OrderViewModel();
            this.DataContext = OrderModel;
        }
    }
}
