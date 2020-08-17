import {render} from "./utils.js";
import {insertPosition} from "./const.js";

import SiteMenuView from "./view/site-menu.js";
import FilterView from "./view/filter.js";
import LoadMoreButtonView from "./view/load-button.js";
import BoardView from "./view/board.js";
import SortView from "./view/sort.js";
import TaskListView from "./view/task-list.js";
import TaskView from "./view/task.js";
import TaskEditView from "./view/task-edit.js";

import {generateTask} from "./mock/task.js";
import {generateFilter} from "./mock/filter.js";

const TASK_COUNT = 22;
const TASK_COUNT_PER_STEP = 8;

const tasks = new Array(TASK_COUNT).fill().map(generateTask);
const filters = generateFilter(tasks);

const siteMainElement = document.querySelector(`.main`);
const siteHeaderElement = siteMainElement.querySelector(`.main__control`);

const renderTask = (taskListElement, task) => {
  const taskComponent = new TaskView(task);
  const taskEditComponent = new TaskEditView(task);

  const replaceCardToForm = () => {
    taskListElement.replaceChild(taskEditComponent.element, taskComponent.element);
  };

  const replaceFormToCard = () => {
    taskListElement.replaceChild(taskComponent.element, taskEditComponent.element);
  };

  taskComponent.element.querySelector(`.card__btn--edit`).addEventListener(`click`, () => {
    replaceCardToForm();
  });

  taskEditComponent.element.querySelector(`form`).addEventListener(`submit`, (evt) => {
    evt.preventDefault();
    replaceFormToCard();
  });

  render(taskListElement, taskComponent.element, insertPosition.BEFOREEND);
};

render(siteHeaderElement, new SiteMenuView().element, insertPosition.BEFOREEND);
render(siteMainElement, new FilterView(filters).element, insertPosition.BEFOREEND);

const boardComponent = new BoardView();
render(siteMainElement, boardComponent.element, insertPosition.BEFOREEND);
render(boardComponent.element, new SortView().element, insertPosition.AFTERBEGIN);

const taskListComponent = new TaskListView();
render(boardComponent.element, taskListComponent.element, insertPosition.BEFOREEND);

for (let i = 0; i < Math.min(tasks.length, TASK_COUNT_PER_STEP); i++) {
  renderTask(taskListComponent.element, tasks[i]);
}

if (tasks.length > TASK_COUNT_PER_STEP) {
  let renderTemplateedTaskCount = TASK_COUNT_PER_STEP;

  const loadMoreButtonComponent = new LoadMoreButtonView();
  render(boardComponent.element, loadMoreButtonComponent.element, insertPosition.BEFOREEND);

  loadMoreButtonComponent.element.addEventListener(`click`, (evt) => {
    evt.preventDefault();
    tasks
      .slice(renderTemplateedTaskCount, renderTemplateedTaskCount + TASK_COUNT_PER_STEP)
      .forEach((task) => renderTask(taskListComponent.element, task));

    renderTemplateedTaskCount += TASK_COUNT_PER_STEP;

    if (renderTemplateedTaskCount >= tasks.length) {
      loadMoreButtonComponent.element.remove();
      loadMoreButtonComponent.removeElement();
    }
  });
}
