try {
  require("dotenv").config();
} catch (e) {}

const ArticlesController = require("./controllers/ArticlesController");

(async () => {
  let data = await ArticlesController.getStale("10-24-2020", "10-24-2021");

  console.log(JSON.stringify(data));
})();