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

  static async getHits(start, end) {
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

    function getHitCount(label) {
      let item = ArticleHits.find(x => x.label == label);
      return item.article_hits || 0;
    }

    return ArticleList.map(x => {
      return {
        label: x.label,
        title: x.question,
        category: x.category,
        subcategory: x.subcategory,
        last_edited: x["last edited"],
        article_hits:
          ArticleLabels.indexOf(x.label) === -1 ? 0 : getHitCount(x.label)
      };
    }).filter(Boolean);
  }
};
