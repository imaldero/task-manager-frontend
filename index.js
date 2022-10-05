if (localStorage.getItem(`token`) || !localStorage.getItem(`token`) === ``) {
  location.href = `./pages/home.html`;
}
const resultmsg = document.querySelector(`#resultmsg`);
const profilebutton = document.querySelector(`#profilebutton`);
const signuppagebtn = document.querySelector(`.signuppagebtn`);
const signinpagebtn = document.querySelector(`#signinpagebtn`);

const loginButton = document.querySelector(`#loginbutton`);
const loginform = document.querySelector(`#loginform`);

loginform.addEventListener(`submit`, (e) => {
  e.preventDefault();
  const data = new FormData(loginform);
  const email = data.get(`email`);
  const pass = data.get(`password`);

  fetch(`https://imaldero-task-manager.herokuapp.com/users/login`, {
    headers: {
      "Content-type": "application/json",
    },
    method: "POST",
    body: JSON.stringify({
      email,
      password: pass,
    }),
  })
    .then((response) => {
      console.log(response.status);
      if (response.status === 401 || response.status === 400) {
        resultmsg.textContent = `Email and/or password is incorrect!`;
        resultmsg.style.color = `#ff5353`;
        return;
      }
      resultmsg.textContent = `Loading...`;
      resultmsg.style.color = `#7aff70`;
      return response.json();
    })
    .then((data) => {
      localStorage.setItem(`token`, data.token);
      location.href = `./pages/home.html`;
    })
    .catch((e) => {
      console.log(e);
    });
});

signuppagebtn.addEventListener(`click`, (e) => {
  e.preventDefault();
  location.href = `./pages/signup.html`;
});
