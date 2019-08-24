var config = require("config")
var axios = require('axios')
const getWeatherForecast = async (lat, lon) => {
    let url = config.get("weather_api") + "/forecast?lat" + lat + "&lon=" + lon + "&appid" + config.get('aapi_key')
    try{
        return await axios.get(url)
    }catch (error){
        
    }
}
module.exports = getWeatherForecast

