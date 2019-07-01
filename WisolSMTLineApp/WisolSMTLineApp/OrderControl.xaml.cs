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
            Loaded += OrderControl_Loaded;
        }

        private void OrderControl_Loaded(object sender, System.Windows.RoutedEventArgs e)
        {
            OrderVM = new OrderViewModel();
            DataContext = OrderVM;
        }
    }
}
