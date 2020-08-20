import BoardView from "../view/board.js";
import SortView from "../view/sort.js";
import TaskListView from "../view/task-list.js";
import NoTaskView from "../view/no-task.js";
import TaskView from "../view/task.js";
import TaskEditView from "../view/task-edit.js";
import LoadMoreButtonView from "../view/load-button.js";
import {render, replace, remove} from "../utils/render.js";
import {InsertPosition} from "../const.js";

const TASK_COUNT_PER_STEP = 8;

export default class Board {
  constructor(boardContainer) {
    this._boardContainer = boardContainer;

    this._boardComponent = new BoardView();
    this._sortComponent = new SortView();
    this._taskListComponent = new TaskListView();
    this._noTaskComponent = new NoTaskView();
  }

  init(boardTasks) {
    this._boardTasks = boardTasks.slice();

    render(this._boardContainer, this._boardComponent, InsertPosition.BEFOREEND);
    render(this._boardComponent, this._taskListComponent, InsertPosition.BEFOREEND);

    this._renderBoard();
  }

  _renderSort() {
    render(this._boardComponent, this._sortComponent, InsertPosition.AFTERBEGIN);
    // Метод для рендеринга сортировки
  }

  _renderTask(task) {
    const taskComponent = new TaskView(task);
    const taskEditComponent = new TaskEditView(task);

    const replaceCardToForm = () => {
      replace(taskEditComponent, taskComponent);
    };

    const replaceFormToCard = () => {
      replace(taskComponent, taskEditComponent);
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

    render(this._taskListComponent, taskComponent, InsertPosition.BEFOREEND);
    // Метод, куда уйдёт логика созданию и рендерингу компонетов задачи,
    // текущая функция renderTask в main.js
  }

  _renderTasks(from, to) {
    this._boardTasks
      .slice(from, to)
      .forEach((boardTask) => this._renderTask(boardTask));
    // Метод для рендеринга N-задач за раз
  }

  _renderNoTasks() {
    render(this._boardComponent, this._noTaskComponent, InsertPosition.AFTERBEGIN);
    // Метод для рендеринга заглушки
  }

  _renderLoadMoreButton() {
    let renderedTaskCount = TASK_COUNT_PER_STEP;

    const loadMoreButtonComponent = new LoadMoreButtonView();
    render(this._boardComponent, loadMoreButtonComponent, InsertPosition.BEFOREEND);

    loadMoreButtonComponent.setClickHandler(() => {
      this._boardTasks
        .slice(renderedTaskCount, renderedTaskCount + TASK_COUNT_PER_STEP)
        .forEach((boardTask) => this._renderTask(boardTask));

      renderedTaskCount += TASK_COUNT_PER_STEP;

      if (renderedTaskCount >= this._boardTasks.length) {
        remove(loadMoreButtonComponent);
      }
    });
    // Метод, куда уйдёт логика по отрисовке компонетов задачи,
    // текущая функция renderTask в main.js
  }

  _renderTaskList() {
    this._renderTasks(0, Math.min(this._boardTasks.length, TASK_COUNT_PER_STEP));

    if (this._boardTasks.length > TASK_COUNT_PER_STEP) {
      this._renderLoadMoreButton();
    }
  }

  _renderBoard() {
    if (this._boardTasks.every((task) => task.isArchive)) {
      this._renderNoTasks();
      return;
    }

    this._renderSort();
    this._renderTaskList();
    // Метод для инициализации (начала работы) модуля,
    // бОльшая часть текущей функции renderBoard в main.js
  }
}
