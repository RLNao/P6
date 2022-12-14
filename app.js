const express = require("express");
const bodyParser = require("body-parser");

const mongoose = require("mongoose");
const app = express();
const userRoutes = require("./routes/user");
const sauceRoutes = require("./routes/sauce");
const path = require("path");

//
const dotenv = require("dotenv");
const result = dotenv.config();

mongoose
   .connect(
      `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@rlnk.usbhi0m.mongodb.net/?retryWrites=true&w=majority`,
      { useNewUrlParser: true, useUnifiedTopology: true }
   )
   .then(() => console.log("Connexion à MongoDB réussie !"))
   .catch(() => console.log("Connexion à MongoDB échouée !"));

app.use((req, res, next) => {
   res.setHeader("Access-Control-Allow-Origin", "*");
   res.setHeader(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
   );
   res.setHeader(
      "Access-Control-Allow-Methods",
      "GET, POST, PUT, DELETE, PATCH, OPTIONS"
   );
   res.setHeader("Cross-Origin-Ressource-Policy", "same-site");
   next();
});

app.use(bodyParser.json());

app.use("/images", express.static(path.join(__dirname, "images")));
app.use("/api/sauces", sauceRoutes);
app.use("/api/auth", userRoutes);

module.exports = app;
