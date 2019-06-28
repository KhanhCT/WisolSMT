using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Input;

namespace WisolSMTLineApp.ViewModel
{

    public class SettingViewModel : BaseViewModel
    {
        int defaultLots;
        public int DefaultLots
        {
            get { return defaultLots; }
            set
            {
                defaultLots = value;
                OnPropertyChanged(nameof(defaultLots));
            }
        }

        int defaultLevel;
        public int DefaultLevel
        {
            get { return defaultLevel; }
            set
            {
                defaultLevel = value;
                OnPropertyChanged(nameof(DefaultLevel));
            }
        }

        public SettingViewModel()
        {
            DefaultLevel = Setting.DefaultLevel;
            DefaultLots = Setting.DefaultLots;
        }

        public void Save_Click()
        {
            Setting.DefaultLevel = DefaultLevel;
            Setting.DefaultLots = DefaultLots;
        }

        private ICommand _clickCommand;
        public ICommand ClickCommand
        {
            get
            {
                return _clickCommand ?? (_clickCommand = new CommandHandler(() => Save_Click(), () => CanExecute));
            }
        }
        public bool CanExecute
        {
            get
            {
                return true;
            }
        }
    }
}
