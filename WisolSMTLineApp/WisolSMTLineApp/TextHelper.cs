using Newtonsoft.Json;
using System.Collections.Generic;
using System.ComponentModel;
using System.IO;
using System.Linq;
using System.Runtime.CompilerServices;
using System.Threading.Tasks;
using WisolSMTLineApp.Model;

namespace WisolSMTLineApp
{
    public class TextHelper
    {
        public TextHelper()
        {

        }

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

        public static string ReadSetting(string Key)
        {
            var SavedSetting = Settings.Where(x => x.Key == Key).FirstOrDefault();
            if (SavedSetting != null)
            {
                return SavedSetting.Value;
            }
            else
            {
                Settings.Add(new KeyValue() { Key = Key, Value = "" });
                WriteSettingToTxt();
                return "";
            }

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
                    Setting.COMPort = Settings.Where(x => x.Key == "COMPort").FirstOrDefault().Value;
                    Setting.WorkingMode = Settings.Where(x => x.Key == "WorkingMode").FirstOrDefault().Value == "Auto" ? WorkingMode.Auto : WorkingMode.Manual;
                    Setting.DefaultLots = uint.Parse(Settings.Where(x => x.Key == "DefaultLots").FirstOrDefault().Value);
                    Setting.DefaultLevel = uint.Parse(Settings.Where(x => x.Key == "DefaultLevel").FirstOrDefault().Value);
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
            new KeyValue(){Key = "COMPort", Value="COM7"},
            new KeyValue(){Key = "WorkingMode", Value = "0"},
            new KeyValue(){Key = "DefaultLots", Value="24"},
            new KeyValue(){Key = "DefaultLevel", Value="15"}
        };
    }

    public class Setting
    {

        public static event PropertyChangedEventHandler StaticPropertyChanged;
        private static void NotifyStaticPropertyChanged([CallerMemberName] string name = null)
        {
            StaticPropertyChanged?.Invoke(null, new PropertyChangedEventArgs(name));
        }

        public static string COMPort { get; set; }
        public static WorkingMode workingMode;
        public static WorkingMode WorkingMode
        {
            get
            {
                return workingMode;
            }
            set
            {
                workingMode = value;
                TextHelper.Settings.Where(x => x.Key == "WorkingMode").FirstOrDefault().Value = value.ToString();
                TextHelper.WriteSettingToTxt();
            }
        }

        static uint defaultLots;
        public static uint DefaultLots
        {
            get { return defaultLots; }
            set
            {
                defaultLots = value;
                NotifyStaticPropertyChanged("DefaultLots");
                TextHelper.Settings.Where(x => x.Key == "DefaultLots").FirstOrDefault().Value = value.ToString();
                TextHelper.WriteSettingToTxt();
            }
        }

        static uint defaultLevel;
        public static uint DefaultLevel
        {
            get { return defaultLevel; }
            set
            {
                defaultLevel = value;
                NotifyStaticPropertyChanged("DefaultLevel");
                TextHelper.Settings.Where(x => x.Key == "DefaultLevel").FirstOrDefault().Value = value.ToString();
                TextHelper.WriteSettingToTxt();
            }
        }

        static uint orderedNode;
        public static uint OrderedNode
        {
            get { return orderedNode; }
            set
            {
                orderedNode = value;
                NotifyStaticPropertyChanged("OrderedNode");
            }
        }

        static uint elapsedNode;
        public static uint ElapsedNode
        {
            get { return elapsedNode; }
            set
            {
                elapsedNode = value;                
                NotifyStaticPropertyChanged("ElapsedNode");
            }
        }

        static uint remainNode;
        public static uint RemainNode
        {
            get { return remainNode; }
            set
            {
                remainNode = value;
                ElapsedNode++;
                NotifyStaticPropertyChanged("RemainNode");
            }
        }

    }

}
