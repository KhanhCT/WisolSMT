using SMTMornitor.ViewModel;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Data;
using System.Windows.Documents;
using System.Windows.Input;
using System.Windows.Media;
using System.Windows.Media.Imaging;
using System.Windows.Shapes;

namespace SMTMornitor
{
    /// <summary>
    /// Interaction logic for LineMonitor.xaml
    /// </summary>
    public partial class LineMonitor : Window
    {
        private LineViewModel LineModel;
        public LineMonitor()
        {
            InitializeComponent();
            LineModel = new LineViewModel();
            this.DataContext = LineModel;
            Closing += MainWindowClosing;
        }
        private void MainWindowClosing(object sender, CancelEventArgs e)
        {
            LineModel.MainFormClosingListener();
        }
    }
}
