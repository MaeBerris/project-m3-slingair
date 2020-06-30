const flightInput = document.getElementById("flight");
const seatsDiv = document.getElementById("seats-section");
const confirmButton = document.getElementById("confirm-button");
const errorMessageDiv = document.querySelector(".error");

let selection = "";

const renderSeats = (data) => {
  document.querySelector(".form-container").style.display = "block";
  console.log("data", data);
  console.log("seatinfo", data[0].isAvailable);
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

const handleConfirmSeat = (event) => {
  event.preventDefault();
  // TODO: everything in here!
  fetch("/users", {
    method: "POST",
    body: JSON.stringify({
      givenName: document.getElementById("givenName").value,
    }),
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  });
  //window.location = '/seat-select/confirmed?userID=${resultofFetch}'
};
//then in another page window.location.search   this will output this string "?userID=uslkdjf-sdflkjs-sdf" and you can plug that in the body of another request to get the rest of the page or as req.params
