const emailDiv = document.querySelector("#email");
const flightSelectMenu = document.querySelector(".flight-select");
const flightSelect = document.querySelector("#flight");
const reserationForm = document.querySelector("#form-content");
flightSelectMenu.style.visibility = "hidden";
let userEmail = "";

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
};
