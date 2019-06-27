using System.ComponentModel;
using System.Runtime.CompilerServices;
using System.Windows;
using System.Windows.Controls;
using WisolSMTLineApp.Model;

namespace WisolSMTLineApp
{
    /// <summary>
    /// Interaction logic for MonitorControl.xaml
    /// </summary>
    public partial class MonitorControl : UserControl, INotifyPropertyChanged
    {
        static WorkingStatus _WorkingStatus;
        public static WorkingStatus workingStatus
        {
            get { return _WorkingStatus; }
            set
            {
                if (_WorkingStatus != value)
                {
                    _WorkingStatus = value;
                    NotifyStaticPropertyChanged("workingStatus");
                }
            }
        }
        string _Model;
        public string Model
        {
            get { return _Model; }
            set
            {
                if (value != _Model)
                {
                    _Model = value;
                    NotifyPropertyChanged(nameof(Model));
                }
            }
        }

        public MonitorControl()
        {
            InitializeComponent();
            Loaded += MonitorControl_Loaded;
        }

        private void MonitorControl_Loaded(object sender, RoutedEventArgs e)
        {

        }

        public event PropertyChangedEventHandler PropertyChanged;
        public void NotifyPropertyChanged(string propName)
        {
            PropertyChanged?.Invoke(this, new PropertyChangedEventArgs(propName));
        }

        public static event PropertyChangedEventHandler StaticPropertyChanged;

        private static void NotifyStaticPropertyChanged([CallerMemberName] string name = null)
        {
            StaticPropertyChanged?.Invoke(null, new PropertyChangedEventArgs(name));
        }
    }
}
