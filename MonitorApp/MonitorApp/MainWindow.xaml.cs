using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
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
using System.Windows.Navigation;
using System.Windows.Shapes;
using WisolSMTLineApp.Model;

namespace MonitorApp
{
    /// <summary>
    /// Interaction logic for MainWindow.xaml
    /// </summary>
    public partial class MainWindow : Window
    {
        public List<Product> Products { get; set; } = new List<Product>();
        public List<LineInfo> LineInfos { get; set; } = new List<LineInfo>();
        public ObservableCollection<ProductionDtl> UnconfirmOrders { get; set; } = new ObservableCollection<ProductionDtl>();

        public MainWindow()
        {
            InitializeComponent();
            DataContext = this;
            UnconfirmOrders.CollectionChanged += UnconfirmOrders_CollectionChanged;
            Loaded += MainWindow_Loaded;
        }

        private void UnconfirmOrders_CollectionChanged(object sender, System.Collections.Specialized.NotifyCollectionChangedEventArgs e)
        {

        }

        private async void MainWindow_Loaded(object sender, RoutedEventArgs e)
        {
            await MainLoop();
        }

        object LockObject = new object();
        public async Task MainLoop()
        {

            Products = await Api.Controller.GetProducts();
            LineInfos = Api.Controller.getLstLine();
            while (true)
            {
                var List_UnconfirmOrder = Api.Controller.getLstOrderNotFinish(1).ToList();
                if (List_UnconfirmOrder != null)
                {
                    if (UnconfirmOrders.Count > 0)
                    {
                        var MaxID = UnconfirmOrders.Max(x => x.ID);
                        var NewOrder = List_UnconfirmOrder.Where(x => x.ID > MaxID).ToList();
                        NewOrder.ForEach(x =>
                        {
                            x.LineInfo = LineInfos.Where(z => z.ID == x.Line_ID).FirstOrDefault();
                            x.Product = Products.Where(z => z.ID == x.Product_ID).FirstOrDefault();
                            UnconfirmOrders.Add(x);
                        });
                        List<ProductionDtl> ConfirmedOrder = new List<ProductionDtl>();
                        foreach (ProductionDtl Order in UnconfirmOrders)
                        {
                            if (List_UnconfirmOrder.Where(x => x.ID == Order.ID).FirstOrDefault() == null)
                            {
                                ConfirmedOrder.Add(Order);
                            }
                        }
                        if (ConfirmedOrder.Count > 0)
                        {
                            ConfirmedOrder.ForEach(x => UnconfirmOrders.Remove(x));
                        }
                    }
                    else
                    {
                        List_UnconfirmOrder.ForEach(x =>
                        {
                            x.LineInfo = LineInfos.Where(z => z.ID == x.Line_ID).FirstOrDefault();
                            x.Product = Products.Where(z => z.ID == x.Product_ID).FirstOrDefault();
                            UnconfirmOrders.Add(x);
                        });
                    }

                }
                await Task.Delay(1000);
            }
        }

        private void Button_Click(object sender, RoutedEventArgs e)
        {

        }
    }
}
