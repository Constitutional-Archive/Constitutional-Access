
const app = require("./app");
const cors = require("cors");

app.use(cors());

const PORT = process.env.PORT || 5000;
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => console.log(`Listening on port ${PORT}...`));
}
