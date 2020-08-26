import {InsertPosition} from "./const.js";
import BoardPresenter from "./presenter/board.js";
import {render} from "./utils/render.js";

import SiteMenuView from "./view/site-menu.js";
import FilterView from "./view/filter.js";

import {generateTask} from "./mock/task.js";
import {generateFilter} from "./mock/filter.js";

const TASK_COUNT = 22;

const tasks = new Array(TASK_COUNT).fill().map(generateTask);
const filters = generateFilter(tasks);
// console.log(tasks);

const siteMainElement = document.querySelector(`.main`);
const siteHeaderElement = siteMainElement.querySelector(`.main__control`);

const boardPresenter = new BoardPresenter(siteMainElement);

render(siteHeaderElement, new SiteMenuView(), InsertPosition.BEFOREEND);
render(siteMainElement, new FilterView(filters), InsertPosition.BEFOREEND);

boardPresenter.init(tasks);
