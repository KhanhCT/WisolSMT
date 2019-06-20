using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using System.Windows;
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
            InitializeComponent();
            //Loaded += MainWindow_Loaded;
        }

        public static GPIOBoard F0;
        private async void MainWindow_Loaded(object sender, RoutedEventArgs e)
        {
            await TextHelper.InitSetting();
            var COMPort = TextHelper.Settings.Where(x => x.Key == "COMPort").FirstOrDefault();
            try
            {
                F0 = new GPIOBoard(0xF0, COMPort.Value);
                Loop();
            }
            catch (Exception ex)
            {
                MessageBox.Show(ex.Message);
                Application.Current.Shutdown();
                return;
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
