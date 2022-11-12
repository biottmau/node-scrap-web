const { SSL_OP_EPHEMERAL_RSA } = require("constants");
const delay = require("delay");
const fs = require("fs");
const fs1 = require("fs");
const {
  Scraper,
  Root,
  OpenLinks,
  CollectContent,
} = require("nodejs-web-scraper");
var interval = 20 * 1000; // 10 seconds;

async function getGSMData(deviceModel) {
  let config = {
    baseSiteUrl: `https://www.gsmarena.com`,
    startUrl: `https://www.gsmarena.com/res.php3?sSearch=` + deviceModel,
    filePath: "./info/",
    concurrency: 10, 
    maxRetries: 3, 
    logPath: "./logs/", 
  };
  let root = new Root();
  let scrapper = new Scraper(config);
  let link = new OpenLinks(".makers ul a", { name: "link" });
  let title = new CollectContent("h1", { name: "title" });
  let displaySize = new CollectContent('[data-spec="displaysize"] ', {
    name: "display-size",
  });
  let displayResolution = new CollectContent(
    '[data-spec="displayresolution"] ',
    { name: "display-resolution" }
  );
  root.addOperation(link);
  link.addOperation(title);
  link.addOperation(displaySize);
  link.addOperation(displayResolution);
  await scrapper.scrape(root);
  let jsonData = link.getData();
  if (jsonData.length > 0) {
    let jsonEl = jsonData[0];
    let sUrl = jsonEl.address;
    let sName = jsonEl.data[0].data[0];
    let sDisplaySize = jsonEl.data[1].data[0];
    let sDisplayResolution = jsonEl.data[2].data[0];
    let sLog = deviceModel + "|" + sUrl + "|" + sName + "|" + sDisplaySize +"|"+ sDisplayResolution;
    fs1.writeFile('./datos.csv',sLog + "\n",{flag:"a"},() => {});
  }
}



fs.readFile("Devices.txt", "utf8", (err, data) => {
  if (err) {
    console.error(err);
    return;
  }
  let arrModels = data.split("\n");
  fs1.writeFile("./datos.csv", "", () => {});

  for (let i = 0; i < arrModels.length; i++) {
    setTimeout((i) => {
      console.log(arrModels[i]);
      getGSMData(arrModels[i]);
    }, interval * i ,i)
  }
});
