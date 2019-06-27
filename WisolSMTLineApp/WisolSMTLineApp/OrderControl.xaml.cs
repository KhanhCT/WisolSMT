using System.ComponentModel;
using System.Windows.Controls;

namespace WisolSMTLineApp
{
    /// <summary>
    /// Interaction logic for OrderControl.xaml
    /// </summary>
    public partial class OrderControl : UserControl
    {    

        public OrderControl()
        {
            InitializeComponent();
            DataContext = this;
        }

        private void Order_Click(object sender, System.Windows.RoutedEventArgs e)
        {
            MainWindow.ConfirmWindow.Visibility = System.Windows.Visibility.Visible;
            MainWindow.ConfirmWindow.ShowDialog();
        }

        public event PropertyChangedEventHandler PropertyChanged;
        public void NotifyPropertyChanged(string propName)
        {
            PropertyChanged?.Invoke(this, new PropertyChangedEventArgs(propName));
        }
    }
}
