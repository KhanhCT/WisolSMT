using System.ComponentModel;
using System.Runtime.CompilerServices;
using System.Windows;
using System.Windows.Controls;
using WisolSMTLineApp.Model;
using WisolSMTLineApp.ViewModel;
using static PandaApp.GPIOCommunication.GPIOHelper;
using static WisolSMTLineApp.MainWindow;

namespace WisolSMTLineApp
{
    /// <summary>
    /// Interaction logic for MonitorControl.xaml
    /// </summary>
    public partial class MonitorControl : UserControl
    {

        MonitorViewModel MonitorVM;
        public MonitorControl()
        {
            InitializeComponent();
            MonitorVM = new MonitorViewModel();
            DataContext = MonitorVM;
        }



        private void MonitorControl_Loaded(object sender, RoutedEventArgs e)
        {

        }

        private void Ellipse_MouseDown(object sender, System.Windows.Input.MouseButtonEventArgs e)
        {
            //CountingSensor_OnPinValueChanged(null, new GPIOPin.PinValueChangedEventArgs(Edge.Rise));
        }
    }
}
