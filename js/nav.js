const logoutbtn = document.querySelector(`#logoutbtn`);
const tasksbtn = document.querySelector(`#tasksbtn`);
const profilebtn = document.querySelector(`#profilebtn`);

export const navFunc = () => {
  logoutbtn.addEventListener(`click`, (e) => {
    const token = localStorage.getItem(`token`);
    e.preventDefault();
    fetch(`https://imaldero-task-manager.herokuapp.com/users/logoutall`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      method: "POST",
    }).then((response) => {
      localStorage.clear();
      location.href = `./index.html`;
    });
  });

  tasksbtn.addEventListener(`click`, (e) => {
    e.preventDefault();
    location.href = `./home.html`;
  });
  profilebtn.addEventListener(`click`, (e) => {
    e.preventDefault();
    location.href = `./profile.html`;
  });
};
