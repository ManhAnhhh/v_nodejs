module.exports = {
  app: {
    port: 3000,
    static_folder: `${__dirname}/../src/public`,
    router: `${__dirname}/../src/routers/web`,
    view_folder: `${__dirname}/../src/apps/views`,
    view_engine: "ejs",
    session_key: "linhanhh",
    session_secure: false,
    tmp: `${__dirname}/../src/tmp/`,
  },
  mail: {
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: "ngomanhanh2k3@gmail.com",
      pass: "vdch teyz vqom nmiu",
    },
  },
};
