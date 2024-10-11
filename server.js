const express = require("express");
const reload = require("reload");
const path = require("path");
const app = express();
const routes = require("./routes/routes");
const PORT = 3000;

app.use(express.static(path.join(__dirname, "public")));

app.use("/", routes);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

reload(app);
