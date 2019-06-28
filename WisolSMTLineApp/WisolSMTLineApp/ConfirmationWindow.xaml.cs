using System.ComponentModel;
using System.Windows;
using WisolSMTLineApp.ViewModel;

namespace WisolSMTLineApp
{
    /// <summary>
    /// Interaction logic for ConfirmationWindow.xaml
    /// </summary>
    public partial class ConfirmationWindow : Window, INotifyPropertyChanged
    {

        ConfirmOrderViewModel ConfirmOrderVM;
        public ConfirmationWindow()
        {
            InitializeComponent();
            Closing += ConfirmationWindow_Closing;
            ConfirmOrderVM = new ConfirmOrderViewModel();
            DataContext = ConfirmOrderVM;
        }

        private void ConfirmationWindow_Closing(object sender, CancelEventArgs e)
        {
            e.Cancel = true;
            Visibility = Visibility.Collapsed;
        }

        uint orderedNode;
        public uint OrderedNode
        {
            get { return orderedNode; }
            set
            {
                orderedNode = value;
                NotifyPropertyChanged(nameof(OrderedNode));
            }
        }

        public event PropertyChangedEventHandler PropertyChanged;

       
        public void NotifyPropertyChanged(string ProName)
        {
            PropertyChanged?.Invoke(this, new PropertyChangedEventArgs(ProName));
        }
    }
}
