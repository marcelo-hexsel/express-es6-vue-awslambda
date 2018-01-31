import http from "http";
import express from "express";
import cors from "cors";
import morgan from "morgan";
import bodyParser from "body-parser";
import config from "./config.json";
import expressVue from "express-vue";
import path from "path";

let app = express();
app.server = http.createServer(app);

app.use(morgan("dev"));
app.use(
  cors({
    exposedHeaders: config.corsHeaders
  })
);
app.use(
  bodyParser.json({
    limit: config.bodyLimit
  })
);

//vue-express configurations
let vueScript = "https://unpkg.com/vue@2.4.2/dist/vue.js";

if (process.env.NODE_ENV === "production") {
  vueScript = "https://unpkg.com/vue";
}

const vueOptions = {
  rootPath: path.join(__dirname, "views"),
  layout: {
    start: '<div id="app">',
    end: "</div>"
  },
  vue: {
    head: {
      meta: [
        {
          script: vueScript
        }
      ]
    }
  }
};
const expressVueMiddleware = expressVue.init(vueOptions);
app.use(expressVueMiddleware);

//route to view
app.get("/vue-test", (req, res) => {
  const data = {
    otherData: "Something Else"
  };
  const vueOptions = {
    head: {
      title: "Test Vue",
      meta: [
        { property: "og:title", content: "Test Vue" },
        { name: "twitter:title", content: "Test Vue" }
      ]
    }
  };
  res.renderVue("Test", data, vueOptions);
});

//starts vue server
app.server.listen(process.env.PORT || config.port, () => {
  console.log(`Started on port ${app.server.address().port}`);
});

export default app;
