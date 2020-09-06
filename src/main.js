import {InsertPosition} from "./const.js";
import BoardPresenter from "./presenter/board.js";
import {render} from "./utils/render.js";

import SiteMenuView from "./view/site-menu.js";
import FilterView from "./view/filter.js";

import TasksModel from "./model/tasks.js";
import FilterModel from "./model/filter.js";

import {generateTask} from "./mock/task.js";

const TASK_COUNT = 22;

const tasks = new Array(TASK_COUNT).fill().map(generateTask);
const filters = [
  {
    type: `all`,
    name: `ALL`,
    count: 0
  }
];
// console.log(tasks);

const tasksModel = new TasksModel();
tasksModel.setTasks(tasks);

const filterModel = new FilterModel();

const siteMainElement = document.querySelector(`.main`);
const siteHeaderElement = siteMainElement.querySelector(`.main__control`);

const boardPresenter = new BoardPresenter(siteMainElement, tasksModel);

render(siteHeaderElement, new SiteMenuView(), InsertPosition.BEFOREEND);
render(siteMainElement, new FilterView(filters, `all`), InsertPosition.BEFOREEND);

boardPresenter.init();
