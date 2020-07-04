const flightInput = document.getElementById("flight");
const seatsDiv = document.getElementById("seats-section");
const confirmButton = document.getElementById("confirm-button");
const errorMessageDiv = document.querySelector(".error");
let selectedSeat = "";

const renderSeats = (data) => {
  document.querySelector(".form-container").style.display = "block";
  seatsDiv.innerHTML = "";
  const alpha = ["A", "B", "C", "D", "E", "F"];
  for (let r = 1; r < 11; r++) {
    const row = document.createElement("ol");
    row.classList.add("row");
    row.classList.add("fuselage");
    seatsDiv.appendChild(row);
    for (let s = 1; s < 7; s++) {
      const seatNumber = `${r}${alpha[s - 1]}`;
      const seat = document.createElement("li");
      const seatOccupied = `<li><label class="seat"><span id="${seatNumber}" class="occupied">${seatNumber}</span></label></li>`;
      const seatAvailable = `<li><label class="seat"><input type="radio" name="seat" value="${seatNumber}" /><span id="${seatNumber}" class="avail">${seatNumber}</span></label></li>`;
      let foundObject = data.find((item) => {
        return item.id === seatNumber;
      });
      if (foundObject.isAvailable) {
        seat.innerHTML = seatAvailable;
      } else {
        seat.innerHTML = seatOccupied;
      }
      row.appendChild(seat);
    }
  }

  let seatMap = document.forms["seats"].elements["seat"];
  seatMap.forEach((seat) => {
    seat.onclick = () => {
      selection = seat.value;
      seatMap.forEach((x) => {
        if (x.value !== seat.value) {
          document.getElementById(x.value).classList.remove("selected");
        }
      });
      selectedSeat = seat.value;
      document.getElementById(seat.value).classList.add("selected");
      document.getElementById("seat-number").innerText = `(${selection})`;
      confirmButton.disabled = false;
    };
  });
};

const getFlightNumbers = async () => {
  let response = await fetch("/flights", {
    method: "GET",
    headers: {
      accept: "application/json",
    },
  });
  let { allFlights } = await response.json();
  allFlights.forEach((flight) => {
    let option = document.createElement("option");
    option.value = `${flight}`;
    option.innerText = `${flight}`;
    flightInput.appendChild(option);
  });
};

getFlightNumbers();

const toggleFormContent = (event) => {
  const flightNumber = flightInput.value;
  console.log("toggleFormContent: ", flightNumber);
  fetch(`/flights/${flightNumber}`)
    .then((res) => res.json())
    .then((data) => {
      let { status } = data;
      if (status === "flight-not-found") {
        errorMessageDiv.innerText =
          "Sorry, we could not find your selected flight. Please select a flight from the dropdown menu above";
      } else {
        let { flightArray } = data;
        renderSeats(flightArray);
      }
    });
};

const handleConfirmSeat = async (event) => {
  event.preventDefault();
  const response = await fetch("/users", {
    method: "POST",
    body: JSON.stringify({
      givenName: document.getElementById("givenName").value,
      surName: document.querySelector("#surname").value,
      email: document.querySelector("#email").value,
      seat: selectedSeat,
      flight: flightInput.value,
    }),
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  });
  const data = await response.json();
  if (data.status === "bad-request") {
    errorMessageDiv.innerText =
      "Missing request info, please fill in all form fields";
  } else if (data.status === "missmatch-user-info") {
    errorMessageDiv.innerText =
      "We already have a user registered to this email. Please make sure your Name ans SurName match your previous order";
  } else {
    window.location = `/seat-select/confirmed.html?userId=${data.userId}`;
  }
};
//then in another page window.location.search   this will output this string "?userID=uslkdjf-sdflkjs-sdf" and you can plug that in the body of another request to get the rest of the page or as req.params
