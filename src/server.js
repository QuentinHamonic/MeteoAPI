import app from "./app.js";
import {config} from "./config.js"

app.listen(config.port, () => {
  console.log(`MétéoAPI → http://localhost:${config.port}`);
});
