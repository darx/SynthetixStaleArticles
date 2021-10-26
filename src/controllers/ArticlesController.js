const Articles = require("../models/Articles");

const { dateChuncks } = require("../common/helpers");

module.exports = class ArticlesController {
  static async getStale(start, end) {
    const range = dateChuncks(new Date(start), new Date(end), 30);

    const pagination = range.map(
      x =>
        new Promise(resolve => {
          Articles.hits(x).then(resolve);
        })
    );

    const promiseAll = Promise.all(pagination);

    const ArticleHits = (await promiseAll).reduce(
      (acc, val) => acc.concat(val),
      []
    );

    const ArticleList = await Articles.list();

    const ArticleLabels = ArticleHits.map(x => x.label);
    ArticleLabels.push("introka");

    return ArticleList.map(x => {
      if (ArticleLabels.indexOf(x.label) === -1) {
        return {
          label: x.label,
          views: x.views,
          title: x.question,
          content: x.answer,
          last_edited: x["last edited"]
        };
      }
    }).filter(Boolean);
  }
};
