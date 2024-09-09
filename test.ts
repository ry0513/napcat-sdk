import { createClient } from "./src/index";

const client = new createClient({
  baseUrl: "ws://localhost:3001",
  accessToken: "123456789",
});

client.on("socket.open", (res) => {
  console.log("open");
});

client.on("socket.close", () => {
  console.log("close");
});

client.on("socket.error", (err) => {
  console.log("error");
});

client.on("socket.success", (err) => {
  console.log("success");
});

client.on("socket", (res) => {
  console.log("socket");
});

(async () => {
  console.log(await client.test());

  setTimeout(() => {}, 1000000000);
})();
