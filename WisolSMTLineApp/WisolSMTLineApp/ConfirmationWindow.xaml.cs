using System.ComponentModel;
using System.Windows;

namespace WisolSMTLineApp
{
    /// <summary>
    /// Interaction logic for ConfirmationWindow.xaml
    /// </summary>
    public partial class ConfirmationWindow : Window, INotifyPropertyChanged
    {
        public ConfirmationWindow()
        {
            InitializeComponent();
            Loaded += ConfirmationWindow_Loaded;
            Closing += ConfirmationWindow_Closing;
            DataContext = this;
        }

        private void ConfirmationWindow_Closing(object sender, CancelEventArgs e)
        {
            e.Cancel = true;
            Visibility = Visibility.Collapsed;
        }

        private void ConfirmationWindow_Loaded(object sender, RoutedEventArgs e)
        {
            OrderedNode = Setting.DefaultLots;
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

        object lockObject = new object();
        private void Confirm_Click(object sender, RoutedEventArgs e)
        {
            lock (lockObject)
            {
                Setting.OrderedNode += OrderedNode;
                Setting.RemainNode += OrderedNode;
                Visibility = Visibility.Hidden;
            }
        }
        public void NotifyPropertyChanged(string ProName)
        {
            PropertyChanged?.Invoke(this, new PropertyChangedEventArgs(ProName));
        }
    }
}
