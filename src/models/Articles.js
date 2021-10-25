const { fetch } = require("../common/helpers");

module.exports = class Articles {
  static async list() {
    let response = await fetch("https://api.synthetix.com/2.0/external/full_faqs", {
      method: "GET",
      headers: {
        applicationkey: process.env.SYNAPPS_APPLICATIONKEY,
        consumerkey: process.env.SYNAPPS_CONSUMERKEY,
        authorization: process.env.SYNAPPS_AUTHORIZATION,
      },
    });

    return response.items || [];
  }

  static async hits(data) {
    let response = await fetch(
      "https://api.synthetix.com/2.0/metrics/knowledge/internal/ka_article_history",
      {
        method: "GET",
        headers: {
          applicationkey: process.env.SYNAPPS_APPLICATIONKEY,
          consumerkey: process.env.SYNAPPS_CONSUMERKEY,
          authorization: process.env.SYNAPPS_AUTHORIZATION,
        },
        data,
      }
    );

    return response;
  }
};
