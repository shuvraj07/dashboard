// server.js
import jsonServer from "json-server";
import auth from "json-server-auth";

const app = jsonServer.create();
const router = jsonServer.router("db.json");

app.db = router.db;

app.use(auth);
app.use(router);

app.listen(5000, () => {
  console.log("🚀 JSON Server with Auth running on http://localhost:5000");
});
