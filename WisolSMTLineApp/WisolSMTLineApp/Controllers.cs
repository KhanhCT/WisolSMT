using Newtonsoft.Json;
using System.Collections.Generic;
using System.Net.Http;
using System.Threading.Tasks;
using WisolSMTLineApp.Model;

namespace WisolSMTLineApp
{
    public class Controllers
    {
        private static readonly HttpClient _httpClient = new HttpClient();
        public async Task<bool> NewProductionPlan(ProductionPlan obj)
        {
            var jsonObj = Newtonsoft.Json.JsonConvert.SerializeObject(obj);
            using (var content = new StringContent(jsonObj))
            {
                var response = await _httpClient.PostAsync("productionplan", content);
                return response.IsSuccessStatusCode;
            }
        }

        public async Task<ProductionPlan> GetProductionPlan(string workingDate/*, int factoryID, int lineID, */, int shiftID, int workplaceID)
        {
            //string url = "productionplan/workplace/" + workingDate + "/" + factoryID + "/" + lineID + "/" + shiftID + "/" + workplaceID;            
            string url = "productionplan/workplace/" + workingDate + "/" + shiftID + "/" + workplaceID;
            ProductionPlan plan = null;
            using (var response = await _httpClient.GetAsync(url))
            {
                if (response.IsSuccessStatusCode)
                {
                    var content = await response.Content.ReadAsStringAsync();
                    Response<ProductionPlan> resMsg = JsonConvert.DeserializeObject<Response<ProductionPlan>>(content);
                    if (resMsg.Data != null)
                        plan = resMsg.Data;
                }
            }
            return plan;
        }

        public async Task<List<string>> GetAllModel()
        {
            //string url = "productionplan/workplace/" + workingDate + "/" + factoryID + "/" + lineID + "/" + shiftID + "/" + workplaceID;            
            string url = "productionplan/workplace/" + "GetModels";
            List<string> Models = null;
            using (var response = await _httpClient.GetAsync(url))
            {
                if (response.IsSuccessStatusCode)
                {
                    var content = await response.Content.ReadAsStringAsync();
                    List<string> resMsg = JsonConvert.DeserializeObject<List<string>>(content);
                   
                }
            }
            return Models;
        }

        public class Response<T>
        {
            public string Status { get; set; }
            public string Message { get; set; }
            public T Data { get; set; }
        }
    }

    public class Api
    {
        public static Controllers Controllers { get; set; }
    }
}
