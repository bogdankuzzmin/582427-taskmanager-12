import {render} from "./utils.js";
import {INSERT_POSITION} from "./const.js";
import {createSiteMenuTemplate} from "./view/site-menu.js";
import {createFilterTemplate} from "./view/filter.js";
import {createBoardTemplate} from "./view/board.js";
import {createSortTemplate} from "./view/sort.js";
import {createTaskTemplate} from "./view/task.js";
import {createTaskEditTemplate} from "./view/task-edit.js";
import {createLoadMoreButtonTemplate} from "./view/load-button.js";

import {generateTask} from "./mock/task.js";
import {generateFilter} from "./mock/filter.js";


const TASK_COUNT = 22;
const TASK_COUNT_PER_STEP = 8;

const tasks = new Array(TASK_COUNT).fill().map(generateTask);
const filters = generateFilter(tasks);



const siteMainElement = document.querySelector(`.main`);
const siteHeaderElement = siteMainElement.querySelector(`.main__control`);

render(siteHeaderElement, createSiteMenuTemplate(), INSERT_POSITION.beforeend);
render(siteMainElement, createFilterTemplate(filters), INSERT_POSITION.beforeend);
render(siteMainElement, createBoardTemplate(), INSERT_POSITION.beforeend);

const boardElement = siteMainElement.querySelector(`.board`);

render(boardElement, createSortTemplate(), INSERT_POSITION.afterbegin);

const taskListElement = boardElement.querySelector(`.board__tasks`);

render(taskListElement, createTaskEditTemplate(tasks[0]), INSERT_POSITION.beforeend);

for (let i = 1; i < Math.min(tasks.length, TASK_COUNT_PER_STEP); i++) {
  render(taskListElement, createTaskTemplate(tasks[i]), INSERT_POSITION.beforeend);
}

if (tasks.length > TASK_COUNT_PER_STEP) {
  let renderedTaskCount = TASK_COUNT_PER_STEP;

  render(boardElement, createLoadMoreButtonTemplate(), INSERT_POSITION.beforeend);

  const loadMoreButton = boardElement.querySelector(`.load-more`);

  loadMoreButton.addEventListener(`click`, (evt) => {
    evt.preventDefault();
    tasks
      .slice(renderedTaskCount, renderedTaskCount + TASK_COUNT_PER_STEP)
      .forEach((task) => render(taskListElement, createTaskTemplate(task), INSERT_POSITION.beforeend));

    renderedTaskCount += TASK_COUNT_PER_STEP;

    if (renderedTaskCount >= tasks.length) {
      loadMoreButton.remove();
    }
  });
}

