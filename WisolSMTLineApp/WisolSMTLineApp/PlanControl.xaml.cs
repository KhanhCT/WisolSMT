using System;
using System.ComponentModel;
using System.Windows.Controls;
using WisolSMTLineApp.Model;
using WisolSMTLineApp.ViewModel;

namespace WisolSMTLineApp
{
    /// <summary>
    /// Interaction logic for PlanControl.xaml
    /// </summary>
    public partial class PlanControl : UserControl
    {
        public PlanViewModel PlanVM;
        public static int CurrentShift
        {
            get
            {
                //TimeSpan NowTimeStamp = TimeSpan.Parse(DateTime.Now.ToString("hh:mm:ss"));
                if (TodayDateTime >= DayShift.From && TodayDateTime < DayShift.To)
                    return 0;
                else
                    return 1;
            }
        }

        public PlanControl()
        {
            InitializeComponent();           
            PlanVM = new PlanViewModel();
            this.DataContext = PlanVM;
        }
     
        static ShiftPeriod DayShift = new ShiftPeriod() { From = TimeSpan.Parse("08:00:00") };
        static ShiftPeriod NightShift = new ShiftPeriod() { From = TimeSpan.Parse("20:00:00") };
        static TimeSpan TodayDateTime { get { return TimeSpan.Parse(DateTime.Now.ToString("hh:mm:ss")); } }

        private void Create_Click(object sender, System.Windows.RoutedEventArgs e)
        {
            var PlanVM = (PlanViewModel)((Button)sender).DataContext;
            PlanVM.Create_Plan();
        }
    }
}
