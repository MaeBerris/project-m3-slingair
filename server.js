"use strict";

const express = require("express");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const { uuid } = require("uuidv4");
const { flights } = require("./test-data/flightSeating");
const { reservations } = require("./test-data/reservations");

const PORT = process.env.PORT || 8000;

const handleFlight = (req, res) => {
  const { flightNumber } = req.params;
  // get all flight numbers
  const allFlights = Object.keys(flights);
  if (!allFlights.includes(flightNumber)) {
    res.status(404).json({ status: "flight-not-found" });
  } else {
    let flightArray = flights[flightNumber];
    res.status(200).json({ status: "success", flightArray: flightArray });
  }
};

const handleSendFlightList = (req, res) => {
  const allFlights = Object.keys(flights);
  res.status(200).json({ allFlights: allFlights });
};

const handleUserSubmit = (req, res) => {
  let { givenName, surName, email, seat, flight } = req.body;
  let user = reservations.find((item) => {
    return item.email === email;
  });
  if (!givenName || !surName || !email || !seat || !flight) {
    return res.status(400).json({ status: "bad-request" });
  }
  if (user !== undefined) {
    if (user.surName !== surName || user.givenName !== givenName) {
      return res.status(409).json({ status: "missmatch-user-info" });
    } else if (user.flight === flight) {
      user.seat.push(seat);
      let FlightSeatToChange = flights[flight].find((item) => {
        return item.id === seat;
      });
      FlightSeatToChange.isAvailable = false;
      return res.status(201).json({ status: "success", userId: user.id });
    }
  }
  let newUser = {
    id: uuid(),
    flight: flight,
    seat: [seat],
    givenName: givenName,
    surName: surName,
    email: email,
  };
  let FlightSeatToChange = flights[flight].find((item) => {
    return item.id === seat;
  });
  FlightSeatToChange.isAvailable = false;
  reservations.push(newUser);
  console.log(reservations);
  res.status(201).json({ status: "success", userId: newUser.id });
};

const handleConfirmation = (req, res) => {
  let { userId } = req.params;
  console.log("userId", userId);
  let user = reservations.find((reservation) => {
    return reservation.id === userId;
  });
  console.log("user that is sent", user);
  if (user === undefined) {
    res.status(404).json({ status: "no-user" });
  } else {
    res.status(200).json({ status: "success", user: user });
  }
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
  .post("/users", handleUserSubmit)
  .get("/confirmation/:userId", handleConfirmation)
  .use((req, res) => res.send("Not Found"))
  .listen(PORT, () => console.log(`Listening on port ${PORT}`));
