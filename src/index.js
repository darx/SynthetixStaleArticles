try {
  require("dotenv").config();
} catch (e) {}

const path = require("path");
const open = require("open");

const fs = require("fs");
const ArticlesController = require("./controllers/ArticlesController");

const argv = require("minimist")(process.argv.slice(2));

(async () => {
  let data;

  if (!argv.action) {
    data = await ArticlesController.getStale(argv.start, argv.end);
  } else if (argv.action === "hits") {
    data = await ArticlesController.getHits(argv.start, argv.end);
  }

  try {
    fs.unlinkSync("null.json");
  } catch (e) {}

  fs.writeFileSync("null.json", JSON.stringify(data, null, 2));

  try {
    await open.openApp(open.apps.chrome, {
      target: path.resolve("null.json"),
      wait: true,
      arguments: ["--incognito"]
    });

    fs.unlinkSync("null.json");
  } catch (e) {
    console.log(e);
  }
})();
