using System;
using System.Threading;
using System.Threading.Tasks;
using System.Windows;
using System.Windows.Controls;
using static PandaApp.GPIOCommunication.GPIOHelper;

namespace WisolSMTLineApp
{
    /// <summary>
    /// Interaction logic for MainWindow.xaml
    /// </summary>
    public partial class MainWindow : Window
    {
        public MainWindow()
        {
            Init();
            InitializeComponent();
            MainTabControl = MainTab;
            DataContext = this;
        }

        public static TabControl MainTabControl;
        public static ConfirmationWindow ConfirmWindow { get; set; } = new ConfirmationWindow();
        public static GPIOBoard F0 = new GPIOBoard(0xF0);

        private async void Init()
        {
            await TextHelper.InitSetting();
            Setting.WorkingMode = Model.WorkingMode.Auto;
            var COMport = TextHelper.ReadSetting("COMPort");
            try
            {
                if (GPIOBoard.GPIOCOM == null)
                    GPIOBoard.GPIOCOM = new GPIOSerial(COMport);
                Loop();
            }
            catch (Exception ex)
            {
                MessageBox.Show(ex.Message);
                //Application.Current.Shutdown();
                //return;
            }
            try
            {

            }
            catch
            {

            }
        }

        CancellationTokenSource GPIOStateLoopCTS;
        public void Loop()
        {
            if (GPIOStateLoopCTS != null)
                if (!GPIOStateLoopCTS.IsCancellationRequested)
                {
                    GPIOStateLoopCTS.Cancel();
                }

            Task.Run(async () =>
            {
                try
                {
                    GPIOStateLoopCTS = new CancellationTokenSource();
                    while (true)
                    {
                        GPIOStateLoopCTS.Token.ThrowIfCancellationRequested();
                        await F0.GetGPIOsState();
                        Thread.Sleep(30);
                    }
                }
                catch
                {

                }

            });
        }

        public class IN
        {
            public static InputPin CountingSensor = F0.InputPins[0];
        }

        public class OUT
        {
            public static OutputPin GreenLight = F0.OutputPins[0];
            public static OutputPin RedLight = F0.OutputPins[1];
            public static OutputPin OrangeLight = F0.OutputPins[2];
        }
    }
}
