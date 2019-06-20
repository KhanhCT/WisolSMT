using Newtonsoft.Json;
using System.Collections.Generic;
using System.IO;
using System.Threading.Tasks;

namespace WisolSMTLineApp
{
    public class TextHelper
    {
        public static async Task<string> Read(string Path)
        {
            try
            {
                using (StreamReader sr = new StreamReader(Path))
                {
                    string savedText = await sr.ReadToEndAsync();
                    return savedText;
                }
            }
            catch (System.Exception)
            {
                return string.Empty;
            }

        }

        public static async void Write(string TextToWrite)
        {
            using (StreamWriter writer = File.CreateText("Setting.txt"))
            {
                await writer.WriteAsync(TextToWrite);
            }
        }

        public static void WriteSettingToTxt()
        {
            string txt_Setting = JsonConvert.SerializeObject(Settings);
            Write(txt_Setting);
        }

        public class KeyValue
        {
            public string Key { get; set; }
            public string Value { get; set; }
        }

        public static async Task InitSetting()
        {
            try
            {
                string txt_Setting = await Read("Setting.txt");
                if (txt_Setting != string.Empty)
                {
                    Settings = JsonConvert.DeserializeObject<List<KeyValue>>(txt_Setting);
                }
                else
                {
                    {
                        txt_Setting = JsonConvert.SerializeObject(Settings);
                        Write(txt_Setting);
                    }
                }
            }
            catch
            {

            }
        }

        public static List<KeyValue> Settings = new List<KeyValue>()
        {
            new KeyValue(){Key = "COMPort", Value="COM7"}
        };
    }

}
