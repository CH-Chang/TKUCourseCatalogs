const express = require("express");
const consola = require("consola");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const { Nuxt, Builder } = require("nuxt");
const app = express();

// Import and Set Nuxt.js options
const config = require("../nuxt.config.js");
config.dev = process.env.NODE_ENV !== "production";

// Router Declaration
const courseRouter = require("./routes/courseRouter");
const memberRouter = require("./routes/memberRouter");

async function start() {
  // Init Nuxt.js
  const nuxt = new Nuxt(config);

  const { host, port } = nuxt.options.server;

  await nuxt.ready();
  // Build only in dev mode
  if (config.dev) {
    const builder = new Builder(nuxt);
    await builder.build();
  }

  // Give nuxt middleware to express

  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(cookieParser(require("./configs/cookieConfig").sign));
  app.use(session(require("./configs/sessionConfig")));

  // Use Router
  app.use("/api/course", courseRouter);
  app.use("/api/member", memberRouter);
  app.use(nuxt.render);
  // Listen the server
  app.listen(port, host);
  consola.ready({
    message: `Server listening on http://${host}:${port}`,
    badge: true
  });
}
start();
