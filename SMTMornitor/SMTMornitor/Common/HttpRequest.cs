using System;
using System.Text;
using System.Net;
using System.IO;
using System.Net.Http;
using System.Threading.Tasks;
using System.Collections.Generic;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace SMTMornitor.Common
{
    class HttpRequest
    {
        /// <summary>
        /// UserAgent to be used on the requests
        /// </summary>
        public string UserAgent = @"Mozilla/5.0 (Windows; Windows NT 6.1) AppleWebKit/534.23 (KHTML, like Gecko) Chrome/11.0.686.3 Safari/534.23";

        /// <summary>
        /// Cookie Container that will handle all the cookies.
        /// </summary>
        private CookieContainer cJar;
        private NetworkCredential nc;
        private HttpClientHandler _httpClientHandler;
        private JsonSerializer _serializer;
        private HttpClient _client;
        public HttpRequest(NetworkCredential nc)
        {
            cJar = new CookieContainer();
            this.nc = nc;
        }
        public HttpRequest()
        {
            _httpClientHandler = new HttpClientHandler();
            _httpClientHandler.AllowAutoRedirect = false;
            _httpClientHandler.UseDefaultCredentials = true;

            _serializer = JsonSerializer.Create();
            _serializer.NullValueHandling = NullValueHandling.Ignore;

            _client = new HttpClient(_httpClientHandler);
            TimeSpan timeout = TimeSpan.FromMilliseconds(200);
            _client.Timeout = timeout;
            _client.DefaultRequestHeaders.Add("user-agent", UserAgent);
            _client.DefaultRequestHeaders.ConnectionClose = true;
        }
        public void Dispose()
        {
            if (_client != null)
                _client.Dispose();
            if (_httpClientHandler != null)
                _httpClientHandler.Dispose();
        }

        private async Task<IEnumerable<T>> GetResults<T>(string url, HttpMethod method, HttpContent content)
        {
            HttpResponseMessage response = await SendRequest(url, method, content).ConfigureAwait(false);

            using (Stream responseStream = await response.Content.ReadAsStreamAsync().ConfigureAwait(false))
            using (StreamReader sr = new StreamReader(responseStream, Encoding.UTF8))
            using (JsonTextReader jsonTextReader = new JsonTextReader(sr))
            {
                jsonTextReader.CloseInput = false;

                SaveResponse(responseStream);

                JToken token = JToken.Load(jsonTextReader);

                if (token.Type == JTokenType.Array)
                    return token.ToObject<List<T>>(_serializer);

                return new List<T> { token.ToObject<T>(_serializer) };
            }
        }
        private async Task<T> GetResult<T>(string url, HttpMethod method, HttpContent content)
        {
            HttpResponseMessage response = await SendRequest(url, method, content).ConfigureAwait(false);

            using (Stream responseStream = await response.Content.ReadAsStreamAsync().ConfigureAwait(false))
            using (StreamReader sr = new StreamReader(responseStream, Encoding.UTF8))
            using (JsonTextReader jsonTextReader = new JsonTextReader(sr))
            {
                jsonTextReader.CloseInput = false;

                SaveResponse(responseStream);
                return _serializer.Deserialize<T>(jsonTextReader);
            }
        }

        private async Task<HttpResponseMessage> SendRequest(string url, HttpMethod method, HttpContent content)
        {
            HttpRequestMessage request = new HttpRequestMessage(method, url);
            request.Content = content;

            OnHTTPRequestSending?.Invoke(request);

            HttpResponseMessage response = await _client.SendAsync(request).ConfigureAwait(false);

            OnHTTPResponseReceived?.Invoke(response);

            if (response.StatusCode == HttpStatusCode.NoContent)
                throw new RateLimitException("You have reached the 4 requests pr. min. limit of VirusTotal");

            if (response.StatusCode == HttpStatusCode.Forbidden)
                throw new AccessDeniedException("You don't have access to the service. Make sure your API key is working correctly.");

            if (response.StatusCode == HttpStatusCode.RequestEntityTooLarge)
                throw new SizeLimitException(FileSizeLimit);

            if (response.StatusCode != HttpStatusCode.OK)
                throw new Exception("API gave error code " + response.StatusCode);

            if (string.IsNullOrWhiteSpace(response.Content.ToString()))
                throw new Exception("There were no content in the response.");

            return response;
        }
        private void SaveResponse(Stream stream)
        {
            if (OnRawResponseReceived == null)
                return;

            using (MemoryStream ms = new MemoryStream())
            {
                stream.CopyTo(ms);
                OnRawResponseReceived(ms.ToArray());
            }

            stream.Position = 0;
        }
        public event Action<byte[]> OnRawResponseReceived;
        public event Action<HttpRequestMessage> OnHTTPRequestSending;
        public event Action<HttpResponseMessage> OnHTTPResponseReceived;
        public long FileSizeLimit { get; set; } = 33553369;

        public class AccessDeniedException : Exception
        {
            public AccessDeniedException(string message)
                : base(message) { }
        }
        public class RateLimitException : Exception
        {
            public RateLimitException(string message)
                : base(message) { }
        }
        public class SizeLimitException : Exception
        {
            public SizeLimitException(long message)
                : base(message.ToString()) { }
        }
    }
}
