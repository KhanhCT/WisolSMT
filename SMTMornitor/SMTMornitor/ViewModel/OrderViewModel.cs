using SMTMornitor.Model;
using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Collections.Specialized;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows;

namespace SMTMornitor.ViewModel
{
    public class OrderViewModel
    {
        //public List<Product> ProductList { get; set; } = new List<Product>();
        public List<ProdLine> LineInfos { get; set; } = new List<ProdLine>();
        public ObservableCollection<Order> UnconfirmOrders { get; set; } = new ObservableCollection<Order>();

        public OrderViewModel()
        {
        }
        private void OrderMonitorUnloaded(object sender, RoutedEventArgs e)
        {

            UnconfirmOrders.CollectionChanged -= UnconfirmOrdersCollectionChanged;
        }

        private void UnconfirmOrdersCollectionChanged(object sender, NotifyCollectionChangedEventArgs e)
        {
            throw new NotImplementedException();
        }
        public void OnClickListener(object sender, RoutedEventArgs e)
        {

        }
    }
}
