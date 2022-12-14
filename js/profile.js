const namemain = document.querySelector(`#name`);
const emailmain = document.querySelector(`#email`);
const agemain = document.querySelector(`#age`);
const nameedit = document.querySelector(`#name-edit`);
const emailedit = document.querySelector(`#email-edit`);
const ageedit = document.querySelector(`#age-edit`);
const passedit = document.querySelector(`#password-edit`);
const token = localStorage.getItem(`token`);
const editbtn = document.querySelector(`#edit-btn`);
const modal = document.querySelector(`.edit-modal`);
const editcancel = document.querySelector(`#edit-cancel-btn`);
const editform = document.querySelector(`#edit-profile-form`);
const h2 = document.querySelector(`#modal-error`);
const h1 = document.querySelector(`h1`);
const deleteacc = document.querySelector(`#delete-acc-btn`);
const uploadbtn = document.querySelector(`#upload-btn`);
const avatarimage = document.querySelector(`#avatarimage`);
const deleteavatar = document.querySelector(`#delete-avatar-btn`);

import { navFunc } from "./nav.js";
const fetchinfo = async () => {
  await fetch("https://imaldero-task-manager.herokuapp.com/users/me", {
    Method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then((response) => {
      if (response.status === 401) {
        h1.textContent = `Session terminated!`;
        h1.style.color = `#ff5353`;
        localStorage.clear();
        location.href = `../index.html`;
      }
      return response.json();
    })
    .then((data) => {
      namemain.textContent = namemain.textContent + ` ` + data.name;
      emailmain.textContent = emailmain.textContent + ` ` + data.email;
      agemain.textContent = agemain.textContent + ` ` + data.age;
    })
    .catch((error) => {
      //handle error
      console.log(`error` + error);
    });
};
fetchinfo();

navFunc();

editbtn.addEventListener(`click`, (e) => {
  modal.classList.add(`visible`);
  nameedit.value = namemain.textContent.replace(`Name : `, ``);
  emailedit.value = emailmain.textContent.replace(`Email : `, ``);
  ageedit.value = agemain.textContent.replace(`Age : `, ``);
});

editcancel.addEventListener(`click`, (e) => {
  modal.classList.remove(`visible`);
});

editform.addEventListener(`submit`, async (e) => {
  e.preventDefault();
  const data = new FormData(editform);
  const name = data.get(`name`);
  const email = data.get(`email`);
  const age = data.get(`age`);
  const password = data.get(`password`);
  passedit.value = ``;
  let jsnString = { name, email, age };
  if (password !== ``) {
    jsnString.password = password;
  }
  if (password.includes(`password`)) {
    h2.textContent = `The password cannot contain the word "password"!`;
    h2.style.color = `#ff5353`;
    return;
  }
  await fetch(`https://imaldero-task-manager.herokuapp.com/users/me`, {
    headers: {
      "Content-type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    method: "PATCH",
    body: JSON.stringify(jsnString),
  })
    .then((response) => {
      console.log(response.status);
      if (response.status === 404 || response.status === 400) {
        h2.textContent = `Something went wrong!`;
        return;
      } else if (response.status === 500) {
        h2.textContent = `Server error!`;
      }
      namemain.textContent = `Name :`;
      emailmain.textContent = `Email :`;
      agemain.textContent = `Age :`;
      fetchinfo();
      console.log(jsnString);
      if (jsnString.password) {
        logoutall();
      }

      modal.classList.remove(`visible`);

      return response.json();
    })
    .then((data) => {})
    .catch((e) => {
      console.log(e);
    });
});

const logoutall = () => {
  const token = localStorage.getItem(`token`);

  fetch(`https://imaldero-task-manager.herokuapp.com/users/logoutall`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    method: "POST",
  })
    .then((response) => {
      localStorage.clear();
      location.href = `../index.html`;
    })
    .catch((e) => {
      console.log(`error: ` + e);
    });
};

deleteacc.addEventListener(`click`, (e) => {
  if (confirm(`Are you sure you want to delete your account?`)) {
    const token = localStorage.getItem(`token`);

    fetch(`https://imaldero-task-manager.herokuapp.com/users/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      method: "DELETE",
    })
      .then((response) => {
        localStorage.clear();
        location.href = `../index.html`;
      })
      .catch((e) => {
        console.log(`error: ` + e);
      });
  }
});

uploadbtn.addEventListener(`click`, async (e) => {
  e.preventDefault();
  const upload = document.getElementById(`file`);
  const file = upload.files[0];
  // console.log(file);
  const fdata = new FormData();
  fdata.append(`avatar`, file);

  await fetch(`https://imaldero-task-manager.herokuapp.com/users/me/avatar`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: fdata,
  })
    .then((res) => res.json())
    .then((res) => {
      // console.log(res);
      if (res.error === `File too large`) {
        h1.textContent = res.error + `. Max size: 10MB`;
        h1.style.color = `#ff5353`;
      } else if (res.error) {
        h1.textContent = res.error;
        h1.style.color = `#ff5353`;
      }
    })
    .catch((e) => {
      console.log(`error: ` + e);
      h1.textContent = `Your details :`;
      h1.style.color = `#ffffff`;
    });

  fetchAvatar();
});

const fetchAvatar = async () => {
  await fetch("https://imaldero-task-manager.herokuapp.com/users/me/avatar", {
    Method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then((res) => res.blob())
    .then((res) => {
      // console.log(res);
      const imageObjectURL = URL.createObjectURL(res);
      if (res.size <= 0) {
        avatarimage.src = ``;
        avatarimage.classList.remove(`pfp`);
        return;
      }
      avatarimage.classList.add(`pfp`);
      avatarimage.src = imageObjectURL;
    })
    .catch((e) => {
      console.log(`error: ` + e);
    });
};

fetchAvatar();

deleteavatar.addEventListener(`click`, async (e) => {
  await fetch(`https://imaldero-task-manager.herokuapp.com/users/me/avatar`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    method: "DELETE",
  })
    .then((res) => res.json())
    .then((res) => {
      // console.log(res);
    })
    .catch((e) => {
      console.log(`error: ` + e);
    });
  fetchAvatar();
});
