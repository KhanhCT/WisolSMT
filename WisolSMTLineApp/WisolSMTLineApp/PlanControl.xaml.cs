using System;
using System.ComponentModel;
using System.Windows.Controls;

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
        public PlanControl()
        {
            InitializeComponent();
            DataContext = this;
        }

        public event PropertyChangedEventHandler PropertyChanged;
        public void NotifyPropertyChanged(string propName)
        {
            PropertyChanged?.Invoke(this, new PropertyChangedEventArgs(propName));
        }

        private void Create_Click(object sender, System.Windows.RoutedEventArgs e)
        {
            SelectedDate = DateTime.Now;
        }
    }
}
