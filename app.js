const express = require("express");
const http = require("https");
const bodyParser = require("body-parser");
const app = express();

app.set("view engine", "ejs"); //EJS

app.use(express.static("public")); //To send CSS file
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

// When client post on our server
app.post("/", function (req, res) {
  const query = req.body.cityName;
  const apiKey = "fd7b18eb0894ca1a0198252e937295eb";
  const unit = "metric";

  const url =
    "https://api.openweathermap.org/data/2.5/weather?q=" +
    query +
    "&appid=" +
    apiKey +
    "&units=" +
    unit +
    "";

  // Server contacting external source (openweathermap) for data
  http.get(url, function (response) {
    // Response is received from external server
    response.on("data", function (data) {
      try {
        const weatherData = JSON.parse(data); //As data comes in hexadecimal So we have to change it
        const temp = weatherData.main.temp;
        const weatherDescription = weatherData.weather[0].description;
        const icon = weatherData.weather[0].main;
        const location = weatherData.name;
        const imageUrl = "images/" + icon + ".png";

        res.render("Result", {
          WDescription: weatherDescription,
          image: imageUrl,
          temperature: temp,
          location: location,
        });
      } catch (error) {
        res.render("error", { message: "Enter a Valid City" });
      }
    });
  });
});

// Client types my URL
app.get("/", function (req, res) {
  res.render("home");
});

app.get("*", function (req, res) {
  res.render("error", { message: "Requested URL doesn't exist!" });
});
app.listen(3000);
