using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using WisolSMTLineApp.Model;
using System.Net.Http;
using System.Net.Http.Headers;
using Newtonsoft.Json;
using System.Collections.ObjectModel;

namespace WisolSMTLineApp
{
    public class Controller
    {
        public String _token;
        private HttpClient _httpClient;
        private HttpClientHandler _httpClientHandler;
        /// <summary>
        /// UserAgent to be used on the requests
        /// </summary>

        public Controller()
        {
            _httpClientHandler = new HttpClientHandler();
            _httpClientHandler.AllowAutoRedirect = false;
            _httpClientHandler.UseDefaultCredentials = true;

            _httpClient = new HttpClient(_httpClientHandler);
            _httpClient.BaseAddress = new Uri("http://45.119.212.111:6969/");
            _httpClient.MaxResponseContentBufferSize = 256000;
            TimeSpan timeout = TimeSpan.FromSeconds(20);
            _httpClient.Timeout = timeout;
            _httpClient.DefaultRequestHeaders.Add("Accept", "text/html,application/xhtml+xml,application/xml;q=0.9,image/apng,*/*;q=0.8");
            _httpClient.DefaultRequestHeaders.AcceptEncoding.Add(new StringWithQualityHeaderValue("gzip"));
            _httpClient.DefaultRequestHeaders.AcceptEncoding.Add(new StringWithQualityHeaderValue("deflate"));
            _httpClient.DefaultRequestHeaders.Add("Accept-Language", "en-GB,en;q=0.9,en-US;q=0.8");
            _httpClient.DefaultRequestHeaders.Add("Connection", "keep-alive");
            _httpClient.DefaultRequestHeaders.Add("Cache-Control", "no-cache");
            _httpClient.DefaultRequestHeaders.Add("Pragma", "no-cache");
            _httpClient.DefaultRequestHeaders.Add("User-Agent", "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko; Google Page Speed Insights) Chrome/27.0.1453 Safari/537.36");
        }
        public void Dispose()
        {
            if (_httpClient != null)
                _httpClient.Dispose();
            if (_httpClientHandler != null)
                _httpClientHandler.Dispose();
        }
        public List<Shift> GetShifts()
        {
            string url = "product/getShifts";
            List<Shift> shiftList = null;
            using (var response = _httpClient.GetAsync(url).Result)
            {
                if (response.IsSuccessStatusCode)
                {
                    string content = response.Content.ReadAsStringAsync().Result;
                    Response<List<Shift>> resMsg = JsonConvert.DeserializeObject<Response<List<Shift>>>(content);
                    if (resMsg.Data != null)
                        shiftList = (List<Shift>)resMsg.Data;
                }
                return shiftList;
            }
        }

        public List<Product> GetProducts()
        {
            string url = "product/getLstModel";
            List<Product> productList = null;
            using (var response = _httpClient.GetAsync(url).Result)
            {
                if (response.IsSuccessStatusCode)
                {
                    string content = response.Content.ReadAsStringAsync().Result;
                    Response<List<Product>> resMsg = JsonConvert.DeserializeObject<Response<List<Product>>>(content);
                    if (resMsg.Data != null)
                        productList = resMsg.Data;
                }
            }
            return productList;
        }

        public ProductionPlan GetProductionPlan(string workingDate, int factoryID, int lineID, int shiftID)
        {
            string url = "productionplan/" + workingDate + "/" + factoryID + "/" + lineID + "/" + shiftID;
            ProductionPlan plan = null;
            using (var response = _httpClient.GetAsync(url).Result)
            {
                if (response.IsSuccessStatusCode)
                {
                    var content = response.Content.ReadAsStringAsync().Result;
                    Response<ProductionPlan> resMsg = JsonConvert.DeserializeObject<Response<ProductionPlan>>(content);
                    if (resMsg.Data != null)
                        plan = resMsg.Data;
                }
            }
            return plan;
        }

        public bool NewProductionPlan(ProductionPlan obj)
        {
            var jsonObj = Newtonsoft.Json.JsonConvert.SerializeObject(obj);
            using (var content = new StringContent(jsonObj))
            {
                var response = _httpClient.PostAsync("production/createPlan", content).Result;
                return response.IsSuccessStatusCode;
            }
        }
        public bool UpdateProductQty(ProductionPlan obj)
        {
            var jsonObj = Newtonsoft.Json.JsonConvert.SerializeObject(obj);
            using (var content = new StringContent(jsonObj))
            {
                try
                {
                    var response = _httpClient.PutAsync("production/productqty", content).Result;
                    return response.IsSuccessStatusCode;
                }
                catch (Exception)
                {
                    return false;
                }
            }
        }

        public bool NewProductionDtl(ProductionDtl obj)
        {
            var jsonObj = Newtonsoft.Json.JsonConvert.SerializeObject(obj);
            using (var content = new StringContent(jsonObj))
            {
                var response = _httpClient.PostAsync("productiondtl", content).Result;
                return response.IsSuccessStatusCode;
            }
        }

        public bool CreateOrder(ProductionDtl obj)
        {
            var jsonObj = Newtonsoft.Json.JsonConvert.SerializeObject(obj);
            using (var content = new StringContent(jsonObj))
            {
                try
                {
                    var ret = _httpClient.PostAsync("production/createOrderDtl'", content).Result;
                    return ret.IsSuccessStatusCode;
                }
                catch (Exception)
                {
                    return false;
                }
            }
        }

        public bool ConfirmOrder(ProductionDtl obj)
        {
            var jsonObj = Newtonsoft.Json.JsonConvert.SerializeObject(obj);
            using (var content = new StringContent(jsonObj))
            {
                try
                {
                    var ret = _httpClient.PutAsync("production/submitOrderDtl", content).Result;
                    return ret.IsSuccessStatusCode;
                }
                catch (Exception)
                {
                    return false;
                }
            }
        }

        public List<ProductionDtl> getLstOrderNotFinish(int lineID)
        {
            string url = "production/getLstOrderNotFinish/" + lineID;
            List<ProductionDtl> LstOrderNotFinish = null;
            using (var response = _httpClient.GetAsync(url).Result)
            {
                if (response.IsSuccessStatusCode)
                {
                    var content = response.Content.ReadAsStringAsync().Result;
                    Response<List<ProductionDtl>> resMsg = JsonConvert.DeserializeObject<Response<List<ProductionDtl>>>(content);
                    if (resMsg.Data != null)
                        LstOrderNotFinish = resMsg.Data;
                }

            }
            return LstOrderNotFinish;
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
        public static Controller Controller { get; set; } = new Controller();
    }
}
