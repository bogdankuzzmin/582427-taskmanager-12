import {createElement} from "../utils.js";

const createTaskListTemplate = () => {
  return `<div class="board__tasks"></div>`;
};

export default class TaskList {
  constructor() {
    this._element = null;
  }

  get template() {
    return createTaskListTemplate();
  }

  get element() {
    if (!this._element) {
      this._element = createElement(this.template);
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
