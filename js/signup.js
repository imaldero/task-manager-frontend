if (localStorage.getItem(`token`) || !localStorage.getItem(`token`) === ``) {
  location.href = `./home.html`;
}

const signupform = document.querySelector(`#signupform`);
const resultmsg = document.querySelector(`#resultmsg`);
const signinpagebtn = document.querySelector(`.signinpagebtn`);

signupform.addEventListener(`submit`, (e) => {
  e.preventDefault();
  const data = new FormData(signupform);
  const name = data.get(`name`);
  const email = data.get(`email`);
  const pass = data.get(`password`);

  if (pass.length < 8) {
    resultmsg.textContent = `The password needs to be at least 8 characters long!`;
    resultmsg.style.color = `#ff5353`;
    return;
  } else if (pass.includes(`password`)) {
    resultmsg.textContent = `The password can't contain the word "password"!`;
    resultmsg.style.color = `#ff5353`;
    return;
  }

  resultmsg.textContent = `Loading...`;
  resultmsg.style.color = `#7aff70`;
  fetch(`https://imaldero-task-manager.herokuapp.com/users`, {
    headers: {
      "Content-type": "application/json",
    },
    method: "POST",
    body: JSON.stringify({
      name,
      email,
      password: pass,
    }),
  })
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      console.log(data._message);
      if (data._message === `User validation failed`) {
        resultmsg.textContent = `This email is already registered!`;
        resultmsg.style.color = `#ff5353`;
        throw new Error(`This email is already registered!`);
      }
      localStorage.setItem(`token`, data.token);
      location.href = `./home.html`;
    })

    .catch((e) => {
      console.log(`error` + e);
    });
});

signinpagebtn.addEventListener(`click`, (e) => {
  location.href = `./index.html`;
});
