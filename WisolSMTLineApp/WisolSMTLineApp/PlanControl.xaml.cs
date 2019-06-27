using System;
using System.ComponentModel;
using System.Windows.Controls;
using WisolSMTLineApp.Model;

namespace WisolSMTLineApp
{
    /// <summary>
    /// Interaction logic for PlanControl.xaml
    /// </summary>
    public partial class PlanControl : UserControl, INotifyPropertyChanged
    {

        DateTime _SelectedDate = DateTime.Now;

        public DateTime SelectedDate
        {
            get { return _SelectedDate; }
            set
            {
                _SelectedDate = value;
                NotifyPropertyChanged(nameof(SelectedDate));
            }
        }

        public static Shift CurrentShift
        {
            get
            {
                //TimeSpan NowTimeStamp = TimeSpan.Parse(DateTime.Now.ToString("hh:mm:ss"));
                if (TodayDate >= DayShift.From && TodayDate < DayShift.To)
                    return Shift.DAY;
                else
                    return Shift.NIGHT;
            }
        }

        public PlanControl()
        {
            InitializeComponent();
            Loaded += PlanControl_Loaded;
            DataContext = this;
        }

        private async void PlanControl_Loaded(object sender, System.Windows.RoutedEventArgs e)
        {
            //ModelComboBox.ItemsSource = await Api.Controllers.GetAllModel();
        }

        public event PropertyChangedEventHandler PropertyChanged;
        public void NotifyPropertyChanged(string propName)
        {
            PropertyChanged?.Invoke(this, new PropertyChangedEventArgs(propName));
        }

        private async void Create_Click(object sender, System.Windows.RoutedEventArgs e)
        {
            var x = (int)((Shift)ShiftComboBox.SelectedItem);
            var ToDay = DateTime.Now.ToString("dd/MM/yyyy");
            var SelectedShift = (Shift)ShiftComboBox.SelectedItem;
            var Plan = Api.Controllers.GetProductionPlan(ToDay, (int)SelectedShift, 1);
            if (Plan == null)
            {
                await Api.Controllers.NewProductionPlan(new ProductionPlan()
                {
                    WorkingDate = ToDay,
                    ShiftID = (int)SelectedShift,
                    ProductName = (string)ModelComboBox.SelectedItem
                });
            }
            else
            {
                //Update Production Plan
            }
        }

        static ShiftPeriod DayShift = new ShiftPeriod() { From = TimeSpan.Parse("08:00:00") };
        static ShiftPeriod NightShift = new ShiftPeriod() { From = TimeSpan.Parse("20:00:00") };
        static TimeSpan TodayDate { get { return TimeSpan.Parse(DateTime.Now.ToString("hh:mm:ss")); } }
    }
}
