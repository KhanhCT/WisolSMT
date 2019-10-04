using System;
using System.Collections.Generic;
using System.Xml;

namespace SMTMornitor.Utils
{
    public class ConfigParser
    {
        private static ConfigParser instance;
        private XmlDocument xmlDoc;
        private ConfigParser(string startupPath)
        {
            xmlDoc = new XmlDocument();
            xmlDoc.Load(startupPath);
        }
        public static ConfigParser getInstance(string startupPath)
        {
            if (instance == null)
                instance = new ConfigParser(startupPath);
            return instance;
        }
        public String getApiUrl()
        {
            return xmlDoc.DocumentElement.SelectSingleNode("apiurl").InnerText;
        }
        public String getComPort()
        {
            return xmlDoc.DocumentElement.SelectSingleNode("com_port").InnerText;
        }
        public Dictionary<string, string> getWorkPlaceInfo()
        {
            Dictionary<string, string> result = new Dictionary<string, string>();
            XmlNodeList nodeList = xmlDoc.DocumentElement.SelectNodes("workplace");
            foreach (XmlNode node in nodeList)
            {
                result.Add("factory_code", node.SelectSingleNode("factory_code").InnerText);
                result.Add("line_code", node.SelectSingleNode("line_code").InnerText);
                result.Add("position", node.SelectSingleNode("position").InnerText);
            }
            return result;
        }


        public Dictionary<string, string> getCamAccount()
        {
            Dictionary<string, string> result = new Dictionary<string, string>();
            XmlNodeList nodeList = xmlDoc.DocumentElement.SelectNodes("camera/account");
            foreach (XmlNode node in nodeList)
            {
                result.Add("user", node.SelectSingleNode("user").InnerText);
                result.Add("password", node.SelectSingleNode("password").InnerText);
                break;
            }
            return result;
        }

        public Dictionary<string, string> getMsSqlInfor()
        {
            Dictionary<string, string> result = new Dictionary<string, string>();
            XmlNodeList nodeList = xmlDoc.DocumentElement.SelectNodes("mssql");
            foreach (XmlNode node in nodeList)
            {
                result.Add("address", node.SelectSingleNode("address").InnerText);
                result.Add("database", node.SelectSingleNode("database").InnerText);
                result.Add("user", node.SelectSingleNode("user").InnerText);
                result.Add("password", node.SelectSingleNode("password").InnerText);
                result.Add("port", node.SelectSingleNode("port").InnerText);
                break;
            }
            return result;
        }
        public string getFileServer()
        {
            return xmlDoc.DocumentElement.SelectSingleNode("file_server").InnerText;
        }
        public int getStandardTime()
        {
            string tmp = xmlDoc.DocumentElement.SelectSingleNode("standard_time").InnerText;
            int result = 15;
            try
            {
                result = Int32.Parse(tmp);
            }
            catch (Exception)
            {
                result = 15;
            }
            return result;
        }
        public Dictionary<string, string> getMySqlInfor()
        {
            Dictionary<string, string> result = new Dictionary<string, string>();
            XmlNodeList nodeList = xmlDoc.DocumentElement.SelectNodes("mysql");
            foreach (XmlNode node in nodeList)
            {
                result.Add("address", node.SelectSingleNode("address").InnerText);
                result.Add("database", node.SelectSingleNode("database").InnerText);
                result.Add("user", node.SelectSingleNode("user").InnerText);
                result.Add("password", node.SelectSingleNode("password").InnerText);
                result.Add("port", node.SelectSingleNode("port").InnerText);
                break;
            }
            return result;
        }
    }
}
