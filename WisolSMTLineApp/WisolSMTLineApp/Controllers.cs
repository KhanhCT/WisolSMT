using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Threading.Tasks;
using WisolSMTLineApp.Model;

namespace WisolSMTLineApp
{
    public class Controllers
    {
        private static readonly HttpClient _httpClient = new HttpClient();
        public String _token;
        public string Login(string username, string password)
        {
            Login login = new Login(username, password);
            string url = "login";
            string token = null;
            string jsonObj = Newtonsoft.Json.JsonConvert.SerializeObject(login);
            ;
            using (var content = new StringContent(jsonObj, Encoding.UTF8, "application/json"))
            {
                var response = _httpClient.PostAsync(url, content).Result;
                if (response.IsSuccessStatusCode)
                {
                    string ret = response.Content.ReadAsStringAsync().Result;
                    Response<string> resMsg = JsonConvert.DeserializeObject<Response<string>>(ret);
                    token = (string)resMsg.Data;
                }

                return token;
            }
        }
        public void ChangeAuthorization(String token)
        {
            this._token = token;
            _httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);
        }


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

    public class Login
    {
        string username;
        string password;
        public string DeviceID { get; set; }
        public Login(string _username, string _password)
        {
            username = _username;
            password = _password;
        }
        public Login(string deviceID)
        {
            this.DeviceID = deviceID;
        }

    }

    public class Api
    {
        public static Controllers Controllers { get; set; } = new Controllers();
    }
}
