var axios = require("axios");
getWeatherForecast = async (lat, lon) => {
	// let url = `${config.get(
	// 	"weather_api.url"
	// )}/forecast?lat=${lat}&lon=${lon}$aapid=${config.get(
	// 	"weather_api.aapi_key"
	// )}`;
	let url = `https://openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&aapid=b6907d289e10d714a6e88b30761fae22`;
	try {
		return await axios.get(url);
	} catch (error) {}
};
getRoutes = async (origin = {}, destination = {}) => {
	let url =
		"https://maps.googleapis.com/maps/api/directions/json?origin=21.028511,105.804817&destination=21.18608,106.07631&key=AIzaSyBBu31OKkopGMwY-EH5BIA7df9cvoEnYYo";
	try {
		return await axios.get(
			url,
			(headers = { "Content-Type": "application/json" })
		);
	} catch (error) {}
};

var res = getRoutes();
res.then(value => {
	console.log(value.data);
});
