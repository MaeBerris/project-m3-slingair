const flightSpan = document.querySelector("#flight");
const seatSpan = document.querySelector("#seat");
const nameSpan = document.querySelector("#name");
const emailSpan = document.querySelector("#email");
const errorLi = document.querySelector("#error");

const getUserInfo = async () => {
  let userId = window.location.search.split("=")[1];
  console.log(userId);
  let response = await fetch(`/confirmation/${userId}`, {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
  });
  let data = await response.json();
  if (data.status === "no-user") {
    errorLi.innerText =
      "The user you have requested does not exist, please try again";
  }
  if (data.status === "success") {
    nameSpan.innerText = `${data.user.givenName} ${data.user.surName}`;
    emailSpan.innerText = `${data.user.email}`;
    flightSpan.innerText = `${data.user.flight}`;
    let seatString = "";
    data.user.seat.forEach((seat) => {
      seatString += `${seat} `;
    });
    seatSpan.innerText = `${seatString}`;
  }
};

getUserInfo();
