import express from "express";
import cors from "cors";
import restaurants from "./api/restaurants.route.js";

const server = express();

server.use(cors());
server.use(express.json());

server.get("/", (req, res) => {
  res.send("Server is running...");
});
server.use("/api/v1/restaurants", restaurants);
server.use("*", (req, res) => res.status(404).json({ error: "not found" }));

export default server;
