using SMTMornitor.ViewModel;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Media;

namespace SMTMornitor.Converter
{
    public class OrderStatusToColorConverter
    {
        SolidColorBrush LightGreen = new SolidColorBrush(Color.FromArgb(0x50, 0x00, 0xFF, 0x00));
        SolidColorBrush LightRed = new SolidColorBrush(Color.FromArgb(0x50, 0xFF, 0x00, 0x00));
        SolidColorBrush LightOrange = new SolidColorBrush(Color.FromArgb(0x50, 0xFF, 0xA5, 0x00));//#FFFFA500.
        SolidColorBrush DarkGray = new SolidColorBrush(Colors.DarkGray);//#FFFFA500.
        public object Convert(object value, Type targetType, object parameter, CultureInfo culture)
        {
            var Status = (WorkingStatus)value;
            if (Status == WorkingStatus.NORMAL)
                return LightGreen;
            else if (Status == WorkingStatus.STOP)
            {
                return LightRed;
            }
            else if (Status == WorkingStatus.ORDED)
            {
                return LightOrange;
            }
            else
            {
                return DarkGray;
            }

        }

        public object ConvertBack(object value, Type targetType, object parameter, CultureInfo culture)
        {
            throw new NotImplementedException();
        }
    }
}
