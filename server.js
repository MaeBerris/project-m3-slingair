"use strict";

const express = require("express");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const { flights } = require("./test-data/flightSeating");

const PORT = process.env.PORT || 8000;

const handleFlight = (req, res) => {
  const { flightNumber } = req.params;
  // get all flight numbers
  const allFlights = Object.keys(flights);
  if (!allFlights.includes(flightNumber)) {
    res.status(200).json({ status: "flight-not-found" });
  } else {
    let flightArray = flights[flightNumber];
    res.status(200).json({ status: "success", flightArray: flightArray });
  }
};

const handleSendFlightList = (req, res) => {
  const allFlights = Object.keys(flights);
  res.status(200).json({ allFlights: allFlights });
};
express()
  .use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept"
    );
    next();
  })
  .use(morgan("dev"))
  .use(express.static("public"))
  .use(bodyParser.json())
  .use(express.urlencoded({ extended: false }))

  // endpoints
  .get("/flights", handleSendFlightList)
  .get("/flights/:flightNumber", handleFlight)
  .use((req, res) => res.send("Not Found"))
  .listen(PORT, () => console.log(`Listening on port ${PORT}`));
