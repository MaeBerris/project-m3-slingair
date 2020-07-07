const seatsDiv = document.querySelector("#seats");

const handleFormSubmit = async () => {
  let response = await fetch(`/users`, {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
  });
  let data = await response.json();
  let { reservations } = data;
  let flights = [];
  reservations.forEach((item) => {
    if (!flights.includes(item.flight)) {
      flights.push(item.flight);
    }
  });
  createPlaneDivs(flights);
  flights.forEach((flight) => {
    let div = document.querySelector(`.${flight}`);
    let seatArray = [];
    let onlyFlightArray = reservations.filter((user) => {
      if (user.flight === flight) {
        return user;
      }
    });
    onlyFlightArray.forEach((user) => {
      user.seat.forEach((seat) => {
        seatArray.push(seat);
      });
    });
    renderSeats(seatArray, div, flight, reservations);
  });
};

handleFormSubmit();

function createPlaneDivs(array) {
  array.forEach((flight) => {
    let parentDiv = document.createElement("div");
    parentDiv.classList.add("form-content");
    parentDiv.classList.add("plane");
    parentDiv.innerText = `Flight: ${flight}`;
    seatsDiv.appendChild(parentDiv);
    let childDiv = document.createElement("div");
    childDiv.id = "seats-section";
    childDiv.classList.add(`${flight}`);
    parentDiv.appendChild(childDiv);
  });
}

const renderSeats = (data, div, flightInfo, reservations) => {
  document.querySelector(".form-container").style.display = "block";
  const alpha = ["A", "B", "C", "D", "E", "F"];
  for (let r = 1; r < 11; r++) {
    const row = document.createElement("ol");
    row.classList.add("row");
    row.classList.add("fuselage");
    div.appendChild(row);
    for (let s = 1; s < 7; s++) {
      const seatNumber = `${r}${alpha[s - 1]}`;
      let foundObject = data.find((item) => {
        return item === seatNumber;
      });
      const seat = document.createElement("li");
      // const seatOccupied = `<li><label class="seat"><span id="${seatNumber}" class="occupied">${seatNumber}</span></label></li>`;
      const seatAvailable = `<li><label class="seat"><span id="${seatNumber}" class="avail">${seatNumber}</span></label></li>`;

      if (!foundObject) {
        seat.innerHTML = seatAvailable;
      } else {
        let userInfo = reservations.find((item) => {
          if (item.flight === flightInfo && item.seat.includes(seatNumber)) {
            return item;
          }
        });
        seat.innerHTML = `<li><label class="seat"><span id="${seatNumber}" class="occupied"><a href=/secret-admin/${userInfo.id}>${userInfo.surName}</a></span></label></li>`;
      }
      row.appendChild(seat);
    }
  }
};
