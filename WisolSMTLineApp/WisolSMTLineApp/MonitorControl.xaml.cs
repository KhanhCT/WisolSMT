using System.ComponentModel;
using System.Runtime.CompilerServices;
using System.Windows;
using System.Windows.Controls;
using WisolSMTLineApp.Model;
using static PandaApp.GPIOCommunication.GPIOHelper;
using static WisolSMTLineApp.MainWindow;

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
            IN.CountingSensor.OnPinValueChanged += CountingSensor_OnPinValueChanged;
            Loaded += MonitorControl_Loaded;
        }

        private async void CountingSensor_OnPinValueChanged(object sender, GPIOPin.PinValueChangedEventArgs e)
        {
            if (e.Edge == Edge.Rise)
            {
                if (Setting.RemainNode > 0)
                {
                    Setting.ElapsedNode++;

                    if (Setting.RemainNode <= 10)
                    {
                        //await OUT.OrangeLight.SET();
                        //await OUT.GreenLight.RST();
                        //await OUT.RedLight.RST();
                        Dispatcher.Invoke(() =>
                        {

                        });
                    }
                    else
                    if (Setting.RemainNode > 10)
                    {
                        //await OUT.GreenLight.SET();
                        //await OUT.OrangeLight.RST();
                        //await OUT.RedLight.RST();
                    }
                }
                else if (Setting.RemainNode == 0)
                {
                    //await OUT.OrangeLight.RST();
                    //await OUT.GreenLight.RST();
                    //await OUT.RedLight.SET();
                }
            }
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

        private void Ellipse_MouseDown(object sender, System.Windows.Input.MouseButtonEventArgs e)
        {
            CountingSensor_OnPinValueChanged(null, new GPIOPin.PinValueChangedEventArgs(Edge.Rise));
        }
    }
}
