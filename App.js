const http = require('http');
const fs = require('fs');
var requests = require('request');
const homeFile = fs.readFileSync('home.html','utf-8');

const replaceVal = (tempVal,orgVal) => {

  let temperature = tempVal.replace("{%tempval%}",orgVal.main.temp);
  temperature = temperature.replace("{%tempmin%}",orgVal.main.temp_min);
  temperature = temperature.replace("{%tempmax%}",orgVal.main.temp_max);
  temperature = temperature.replace("{%location%}",orgVal.name);
  temperature = temperature.replace("{%country%}",orgVal.sys.country);
  temperature = temperature.replace("{$tempstatus$}",orgVal.weather[0].main);
  // console.log(temperature);
  return temperature;

};

const server = http.createServer((req, res) => {
    if (req.url == "/") {
      requests(
        `https://api.openweathermap.org/data/2.5/weather?q=Mumbai&appid=85489947a491f6a26bed025a0904402c`
      ).on("data", (chunk) => {
          console.log(chunk);
          const objData = JSON.parse(chunk);
          const arrData = [objData];
          const realTimeValue = arrData.map((val) =>  replaceVal(homeFile,val)
            // console.log(val.main.temp);
           ).join("");
          //  console.log(realTimeValue);
           res.write(realTimeValue);
          
        })
        .on("end", (err) => {
          if (err) return console.log("connection closed due to errors", err);
          res.end();
        });
    } else {
      res.end("File not found");
    }
  });

server.listen(8000,"127.0.0.1", () => {
    console.log("Server is listening at port 8000")
});