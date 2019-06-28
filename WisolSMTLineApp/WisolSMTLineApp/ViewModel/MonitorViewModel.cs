using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using WisolSMTLineApp.Model;
using static PandaApp.GPIOCommunication.GPIOHelper;
using static WisolSMTLineApp.MainWindow;

namespace WisolSMTLineApp.ViewModel
{
    public class MonitorViewModel : BaseViewModel
    {
        static WorkingStatus _WorkingStatus;
        public WorkingStatus WorkingStatus
        {
            get { return _WorkingStatus; }
            set
            {
                if (_WorkingStatus != value)
                {
                    _WorkingStatus = value;
                    OnPropertyChanged("WorkingStatus");
                }
            }
        }
               
        public MonitorViewModel()
        {
            IN.CountingSensor.OnPinValueChanged += CountingSensor_OnPinValueChanged;          
        }
        private void CountingSensor_OnPinValueChanged(object sender, GPIOPin.PinValueChangedEventArgs e)
        {
            if (e.Edge == Edge.Rise)
            {
                if (Setting.RemainNode > 0)
                {
                    Setting.RemainNode--;
                    if (Setting.RemainNode <= 10)
                    {
                        //await OUT.OrangeLight.SET();
                        //await OUT.GreenLight.RST();
                        //await OUT.RedLight.RST();
                     
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
    }
}
