import {render} from "./utils.js";
import {InsertPosition} from "./const.js";

import SiteMenuView from "./view/site-menu.js";
import FilterView from "./view/filter.js";
import LoadMoreButtonView from "./view/load-button.js";
import BoardView from "./view/board.js";
import SortView from "./view/sort.js";
import TaskListView from "./view/task-list.js";
import TaskView from "./view/task.js";
import TaskEditView from "./view/task-edit.js";
import NoTaskView from "./view/no-task.js";

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

  const escKeyDownHandler = (evt) => {
    if (evt.key === `Escape` || evt.key === `Esc`) {
      evt.preventDefault();
      replaceFormToCard();

      document.removeEventListener(`keydown`, escKeyDownHandler);
    }
  };

  taskComponent.setEditClickHandler(() => {
    replaceCardToForm();
    document.addEventListener(`keydown`, escKeyDownHandler);
  });

  taskEditComponent.setFormSubmitHandler(() => {
    replaceFormToCard();

    document.removeEventListener(`keydown`, escKeyDownHandler);
  });

  render(taskListElement, taskComponent.element, InsertPosition.BEFOREEND);
};

const renderBoard = (boardContainer, boardTasks) => {
  const boardComponent = new BoardView();
  const taskListComponent = new TaskListView();

  render(boardContainer, boardComponent.element, InsertPosition.BEFOREEND);
  render(boardComponent.element, taskListComponent.element, InsertPosition.BEFOREEND);

  if (boardTasks.every((task) => task.isArchive)) {
    render(boardComponent.element, new NoTaskView().element, InsertPosition.AFTERBEGIN);
    return;
  }

  render(boardComponent.element, new SortView().element, InsertPosition.AFTERBEGIN);

  boardTasks
  .slice(0, Math.min(tasks.length, TASK_COUNT_PER_STEP))
  .forEach((boardTask) => renderTask(taskListComponent.element, boardTask));

  if (tasks.length > TASK_COUNT_PER_STEP) {
    let renderTemplateedTaskCount = TASK_COUNT_PER_STEP;

    const loadMoreButtonComponent = new LoadMoreButtonView();
    render(boardComponent.element, loadMoreButtonComponent.element, InsertPosition.BEFOREEND);

    loadMoreButtonComponent.setClickHandler(() => {
      boardTasks
        .slice(renderTemplateedTaskCount, renderTemplateedTaskCount + TASK_COUNT_PER_STEP)
        .forEach((boardTask) => renderTask(taskListComponent.element, boardTask));

      renderTemplateedTaskCount += TASK_COUNT_PER_STEP;

      if (renderTemplateedTaskCount >= boardTasks.length) {
        loadMoreButtonComponent.element.remove();
        loadMoreButtonComponent.removeElement();
      }
    });
  }
};

render(siteHeaderElement, new SiteMenuView().element, InsertPosition.BEFOREEND);
render(siteMainElement, new FilterView(filters).element, InsertPosition.BEFOREEND);

renderBoard(siteMainElement, tasks);
