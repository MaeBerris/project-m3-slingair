const emailDiv = document.querySelector("#email");
const reserationForm = document.querySelector("#form-content");
const seatsDiv = document.querySelector("#seats");

const handleFormSubmit = async (event) => {
  event.preventDefault();
  userEmail = emailDiv.value;
  console.log(userEmail);
  let response = await fetch(`/reservation/${userEmail}`, {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
  });
  let data = await response.json();
  console.log(data);
  let flights = [];
  data.userArray.forEach((item) => {
    flights.push(item.flight);
  });
  reserationForm.style.display = "none";
  createPlaneDivs(flights);
  flights.forEach((flight) => {
    let div = document.querySelector(`.${flight}`);
    let orderInfo = data.userArray.find((item) => {
      return item.flight === flight;
    });
    let seatArray = orderInfo.seat;
    renderSeats(seatArray, div);
  });
};

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

const renderSeats = (data, div) => {
  document.querySelector(".form-container").style.display = "block";
  const alpha = ["A", "B", "C", "D", "E", "F"];
  for (let r = 1; r < 11; r++) {
    const row = document.createElement("ol");
    row.classList.add("row");
    row.classList.add("fuselage");
    div.appendChild(row);
    for (let s = 1; s < 7; s++) {
      const seatNumber = `${r}${alpha[s - 1]}`;
      const seat = document.createElement("li");
      const seatOccupied = `<li><label class="seat"><span id="${seatNumber}" class="occupied">${seatNumber}</span></label></li>`;
      const seatAvailable = `<li><label class="seat"><span id="${seatNumber}" class="avail">${seatNumber}</span></label></li>`;
      let foundObject = data.find((item) => {
        return item === seatNumber;
      });
      if (!foundObject) {
        seat.innerHTML = seatAvailable;
      } else {
        seat.innerHTML = seatOccupied;
      }
      row.appendChild(seat);
    }
  }
};
