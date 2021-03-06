const https = require("https");
const querystring = require("querystring");

const { parse } = require("url");

const formatDate = d => {
  const date = typeof d === "string" ? new Date(d) : d;

  const yyyy = new Intl.DateTimeFormat("en", { year: "numeric" }).format(date);
  const mm = new Intl.DateTimeFormat("en", { month: "2-digit" }).format(date);
  const dd = new Intl.DateTimeFormat("en", { day: "2-digit" }).format(date);

  return `${dd}-${mm}-${yyyy}`;
};

const dateChuncks = (start, end, size) => {
  let result = [];

  let s = new Date(start);

  do {
    let e = new Date(s.getFullYear(), s.getMonth(), s.getDate() + size);

    result.push({
      startdate: formatDate(new Date(s)),
      enddate: formatDate(e <= end ? e : new Date(end))
    });

    s.setDate(s.getDate() + size + 1);
  } while (s < end);

  return result;
};

const fetch = (url, options) => {
  if (options.method.toLowerCase() === "get") {
    url = url + "?" + querystring.encode(options.data);
  }

  const parts = parse(url);
  const opts = Object.assign({}, options, {
    port: parts.protocol != "https:" ? 80 : 443,
    path: parts.path,
    host: parts.host
  });

  return new Promise((resolve, reject) => {
    const req = https.request(opts, res => {
      const chunks = [];

      res.on("data", chunk => {
        chunks.push(chunk);
      });

      res.on("end", () => {
        const body = Buffer.concat(chunks);
        resolve(JSON.parse(body.toString()));
      });
    });

    req.end();
  });
};

// const toCSV = arr => {
//   var array = typeof arr != "object" ? JSON.parse(arr) : arr;
//   var str = "";

//   for (var i = 0; i < array.length; i++) {
//     var line = "";
//     for (var index in array[i]) {
//       if (line != "") line += ",";

//       line += array[i][index];
//     }

//     str += line + "\r\n";
//   }

//   return str;
// };
const toCSV = arr => {
  const items = arr;

  const replacer = (_, value) => (value === null ? "" : value);
  const header = Object.keys(items[0]);
  
  const csv = [
    header.join(","),
    ...items.map(row =>
      header
        .map(fieldName => JSON.stringify(row[fieldName], replacer))
        .join(",")
    )
  ].join("\r\n");

  return csv;
};

module.exports = { fetch, dateChuncks, formatDate, toCSV };
