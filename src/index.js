try {
  require("dotenv").config();
} catch (e) {}

const path = require("path");
const open = require("open");

const fs = require("fs");
const ArticlesController = require("./controllers/ArticlesController");
const { toCSV } = require("./common/helpers");

const argv = require("minimist")(process.argv.slice(2));

(async () => {
  let data;
  let fileType = ".json";

  if (!argv.action) {
    data = await ArticlesController.getStale(argv.start, argv.end);
  } else if (argv.action === "hits") {
    data = await ArticlesController.getHits(argv.start, argv.end);
  }

  if (argv.format && argv.format === "csv") {
    data = toCSV(data);
    fileType = "";
  } else {
    data = JSON.stringify(data, null, 2);
  }

  try {
    fs.unlinkSync(`null`);
    fs.unlinkSync(`null${fileType}`);
  } catch (e) {}

  fs.writeFileSync(`null${fileType}`, data, 'utf8');

  try {
    await open.openApp(open.apps.chrome, {
      target: path.resolve(`null${fileType}`),
      wait: true,
      arguments: ["--incognito"]
    });

  } catch (e) {
    console.log(e);
  }
})();
