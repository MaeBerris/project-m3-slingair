const emailDiv = document.querySelector("#email");
function createSeats(data) {}

const handleFormSubmit = async (event) => {
  event.preventDefault();
  let userEmail = emailDiv.value;
  console.log(userEmail);
  let response = await fetch(`/reservation/${userEmail}`, {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
  });
  let data = await response.json();
  console.log(data);
};
