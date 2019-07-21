using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using WisolSMTLineApp.ViewModel;

namespace WisolSMTLineApp.Model
{
    public class Plan : BaseViewModel
    {
        public string modelName { get; set; }
        int _order;
        public int order
        {
            get { return _order; }
            set { _order = value; OnPropertyChanged(nameof(order)); }
        }
        int _elapsed;
        private int _remain;

        public int elapsed
        {
            get { return _elapsed; }
            set { _elapsed = value; OnPropertyChanged(nameof(elapsed)); }
        }

        public int remain
        {
            get
            {
                return _remain;
            }
            set
            {
                _remain = value;
                OnPropertyChanged(nameof(remain));
            }
        }
    }
}
