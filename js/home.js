const newtasks = document.querySelector(`#new-tasks`);
const main = document.querySelector(`#main-container`);
const editmodal = document.querySelector(`.edit-modal`);
const editcancelbtn = document.querySelector(`#edit-cancel-btn`);
const createcancelbtn = document.querySelector(`#create-cancel-btn`);
const desctext = document.querySelector(`#desc-text`);
const editcompleted = document.querySelector(`#edit-completed`);
const createcompleted = document.querySelector(`#create-completed`);
const editform = document.querySelector(`#edit-task-form`);
const createform = document.querySelector(`#create-task-form`);
const newtaskbtn = document.querySelector(`.new-task-btn`);
const allcontainer = document.querySelector(`#all-conteiner`);
const createmodal = document.querySelector(`.create-modal`);
const newdesctext = document.querySelector(`#new-desc-text`);
const filterbtn = document.querySelector(`#filter-btn`);
const h1 = document.querySelector(`h1`);

import { navFunc } from "./nav.js";
localStorage.setItem(`filter`, ``);

const fetchTasks = (filter = ``) => {
  const token = localStorage.getItem(`token`);
  fetch(`https://imaldero-task-manager.herokuapp.com/tasks${filter}`, {
    Method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      let completed = ``;
      data.forEach((e) => {
        if (e.completed === false) {
          completed = `Not Done Yet`;
        } else if (e.completed === true) {
          completed = `Done`;
        }
        const task = `<section class="task-single taskhtml" >
        <p id="${e._id}" class="taskhtml task-desc">${e.description}</p>
        <p id="${e._id}" class="completed taskhtml">${completed}</p>
        <section class="editndel">
        <button id="${e._id}" class="delete-task-btn taskhtml">Delete</button>
        </section>
        </section>`;

        newtasks.insertAdjacentHTML(`afterend`, task);
      });
      document.querySelectorAll(`.delete-task-btn`).forEach((el) => {
        el.addEventListener(`click`, async (e) => {
          deleteTaskFunc(el);
        });
      });
      const quickComp = document.querySelectorAll(`.completed`);
      modalCompBtns(quickComp);
      const taskDescriptions = document.querySelectorAll(`.task-desc`);
      taskDescriptionEdit(taskDescriptions);
    })
    .catch((error) => {
      console.log(`error` + error);
    });
};

navFunc();
fetchTasks();

const taskDescriptionEdit = (tasks) => {
  tasks.forEach((el) => {
    el.style.cursor = `pointer`;
    el.addEventListener(`click`, (e) => {
      desctext.value = el.textContent;
      editcompleted.textContent = el.parentElement.children[1].textContent;
      editcompleted.style.color = el.parentElement.children[1].style.color;
      desctext._id = el.parentElement.children[0].id;
      main.classList.add(`main-container`);
      editmodal.classList.add(`visible`);
    });
  });
};

filterbtn.addEventListener(`click`, async (e) => {
  let filter = ``;
  if (filterbtn.textContent === `filter: newest`) {
    filter = `?sortBy=createdAt:desc`;
    filterbtn.textContent = `filter: oldest`;
  } else if (filterbtn.textContent === `filter: oldest`) {
    filter = `?sortBy=createdAt:asc`;
    filterbtn.textContent = `filter: newest`;
  }
  localStorage.setItem(`filter`, filter);

  refreshTasks();
});

const modalCompBtns = (btns) => {
  btns.forEach((el) => {
    if (el.textContent === `Not Done Yet`) {
      el.style.color = `#ff5353`;
    } else if (el.textContent === `Done`) {
      el.style.color = `#7aff70`;
    }
    el.addEventListener(`click`, (e) => {
      let comp;
      if (el.textContent === `Not Done Yet`) {
        el.textContent = `Done`;
        el.style.color = `#7aff70`;
        comp = true;
      } else if (el.textContent === `Done`) {
        comp = false;
        el.textContent = `Not Done Yet`;
        el.style.color = `#ff5353`;
      }

      if (el.classList.contains(`completed`)) {
        updateCompleted(comp, el.id);
      }
    });
  });
};
const createmodalCompleted = document.querySelectorAll(
  `.create-modal-completed`
);
modalCompBtns(createmodalCompleted);

const editmodalCompleted = document.querySelectorAll(`.edit-modal-completed`);
modalCompBtns(editmodalCompleted);

const updateCompleted = async (comp, id) => {
  const token = localStorage.getItem(`token`);
  await fetch(`https://imaldero-task-manager.herokuapp.com/tasks/${id}`, {
    headers: {
      "Content-type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    method: "PATCH",
    body: JSON.stringify({
      completed: comp,
    }),
  })
    .then((response) => {
      console.log(response.status);
      if (response.status === 404 || response.status === 400) {
        h1.textContent = `Something went wrong!`;
        return;
      } else if (response.status === 500) {
        h1.textContent = `Server error!`;
      }

      return response.json();
    })
    .then((data) => {})
    .catch((e) => {
      console.log(e);
    });
};

const refreshTasks = () => {
  const localfilter = localStorage.getItem(`filter`);
  const taskhtml = document.querySelectorAll(`.taskhtml`);
  taskhtml.forEach((el) => {
    el.remove();
  });
  fetchTasks(localfilter);
};

const deleteTaskFunc = async function (el) {
  const token = localStorage.getItem(`token`);
  await fetch(`https://imaldero-task-manager.herokuapp.com/tasks/${el.id}`, {
    headers: {
      "Content-type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    method: "DELETE",
  })
    .then((response) => {
      console.log(response.status);
      if (response.status === 404 || response.status === 400) {
        h1.textContent = `Something went wrong!`;
        return;
      } else if (response.status === 500) {
        h1.textContent = `Server error!`;
      }
      refreshTasks();

      return response.json();
    })
    .then((data) => {})
    .catch((e) => {
      console.log(e);
    });
};

editcancelbtn.addEventListener(`click`, (e) => {
  main.classList.remove(`main-container`);
  editmodal.classList.remove(`visible`);
});

editform.addEventListener(`submit`, async (e) => {
  e.preventDefault();
  main.classList.remove(`main-container`);
  editmodal.classList.remove(`visible`);

  const data = new FormData(editform);
  const description = data.get(`description`);
  let completed = ``;
  if (editcompleted.textContent === `Done`) {
    completed = `true`;
  } else if (editcompleted.textContent === `Not Done Yet`) {
    completed = `false`;
  }
  const token = localStorage.getItem(`token`);
  await fetch(
    `https://imaldero-task-manager.herokuapp.com/tasks/${desctext._id}`,
    {
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      method: "PATCH",
      body: JSON.stringify({
        completed,
        description,
      }),
    }
  )
    .then((response) => {
      console.log(response.status);
      if (response.status === 404 || response.status === 400) {
        h1.textContent = `Something went wrong!`;
        return;
      } else if (response.status === 500) {
        h1.textContent = `Server error!`;
      }
      refreshTasks();
      return response.json();
    })
    .then((data) => {})
    .catch((e) => {
      console.log(e);
    });
});

newtaskbtn.addEventListener(`click`, (e) => {
  createmodal.classList.add(`visible`);
  allcontainer.classList.add(`main-container`);
});

createcancelbtn.addEventListener(`click`, (e) => {
  createmodal.classList.remove(`visible`);
  allcontainer.classList.remove(`main-container`);
  newdesctext.value = ``;
});

createform.addEventListener(`submit`, async (e) => {
  e.preventDefault();
  allcontainer.classList.remove(`main-container`);
  createmodal.classList.remove(`visible`);
  const data = new FormData(createform);
  newdesctext.value = ``;
  const description = data.get(`description`);
  let completed = ``;
  if (createcompleted.textContent === `Done`) {
    completed = `true`;
  } else if (createcompleted.textContent === `Not Done Yet`) {
    completed = `false`;
  }
  const token = localStorage.getItem(`token`);

  await fetch(`https://imaldero-task-manager.herokuapp.com/tasks`, {
    headers: {
      "Content-type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    method: "POST",
    body: JSON.stringify({
      completed,
      description,
    }),
  })
    .then((response) => {
      console.log(response.status);
      if (response.status === 404 || response.status === 400) {
        h1.textContent = `Something went wrong!`;
        return;
      } else if (response.status === 500) {
        h1.textContent = `Server error!`;
      }
      createcompleted.value = ``;
      refreshTasks();

      return response.json();
    })
    .then((data) => {})
    .catch((e) => {
      console.log(e);
    });
});
