using System.ComponentModel;
using System.Windows.Controls;
using WisolSMTLineApp.ViewModel;

namespace WisolSMTLineApp
{
    /// <summary>
    /// Interaction logic for OrderControl.xaml
    /// </summary>
    public partial class OrderControl : UserControl
    {
        OrderViewModel OrderVM;
        public OrderControl()
        {
            InitializeComponent();
            OrderVM = new OrderViewModel();
            DataContext = OrderVM;
        }     
    }
}
