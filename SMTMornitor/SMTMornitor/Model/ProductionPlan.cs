using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Newtonsoft.Json;

namespace SMTMornitor.Model
{
    public class ProductionPlan
    {
        [JsonProperty(PropertyName = "id")]
        public int ID { get; set; }

        [JsonProperty(PropertyName = "id")]
        public int Order { get; set; }

        [JsonProperty(PropertyName = "elapsed")]
        public int Elapsed { get; set; }

        [JsonProperty(PropertyName = "remain")]
        public int Remain { get; set; }

        [JsonProperty(PropertyName = "is_complete")]
        public bool IsComplete { get; set; }

        [JsonProperty(PropertyName = "created_time")]
        public DateTime CreatedTime { get; set; }

        [JsonProperty(PropertyName = "finished_time")]
        public DateTime FinishedTime { get; set; }

        [JsonProperty(PropertyName = "product_id")]
        public int ProductID { get; set; }

        [JsonProperty(PropertyName = "line_id")]
        public int LineID { get; set; }
    }
}
