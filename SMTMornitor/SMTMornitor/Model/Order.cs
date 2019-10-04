using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Newtonsoft.Json;

namespace SMTMornitor.Model
{
    public class Order
    {
        [JsonProperty(PropertyName = "id")]
        public int ID { get; set; }
        [JsonProperty(PropertyName = "amount")]
        public int Amount { get; set; }
        [JsonProperty(PropertyName = "create_time")]
        public DateTime CreatedTime { get; set; }
        [JsonProperty(PropertyName = "id")]
        public DateTime ConfirmedTime { get; set; }
        [JsonProperty(PropertyName = "confirm_time")]
        public bool IsConfirmed { get; set; }
        [JsonProperty(PropertyName = "product_id")]
        public int ProductID { get; set; }
    }
    public enum OrderStatus { OK, WAITING, SHORTAGE }
    public enum OrderShortageReason { OK, WAITING, MGZShortage, PCBShortage, JIGShortage, PLMWaiting }
}
