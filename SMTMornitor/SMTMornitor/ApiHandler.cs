using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using SMTMornitor.Model;
using System.Net.Http;
using SMTMornitor.Common;
using System.Net.Http.Headers;
using Newtonsoft.Json;
using SMTMornitor.Utils;

namespace SMTMornitor.Api
{
    public class ApiHandler
    {
        public String _token;
        private HttpClient _httpClient;
        private HttpClientHandler _httpClientHandler;
        public ApiHandler()
        {
            _httpClientHandler = new HttpClientHandler();
            _httpClientHandler.AllowAutoRedirect = false;
            _httpClientHandler.UseDefaultCredentials = true;

            _httpClient = new HttpClient(_httpClientHandler);
            _httpClient.BaseAddress = new Uri(ConfigParser.getInstance("").getApiUrl());
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
        public List<ProdLine> GetRunningPlan()
        {
            List<ProdLine> ListLine = new List<ProdLine>();
            try
            {
                string url = "production-plan";
                using (var response = _httpClient.GetAsync(url).Result)
                {
                    if (response.IsSuccessStatusCode)
                    {
                        var content = response.Content.ReadAsStringAsync().Result;
                        List<ProdLine> resMsg = JsonConvert.DeserializeObject<List<ProdLine>>(content);
                        if (resMsg != null)
                            ListLine = resMsg;
                    }
                }
            }
            catch (Exception)
            {

            }
            return ListLine;
        }
    }
    
}
