import {createElement} from "../utils.js";

const createNoTaskTemplate = () => {
  return `<p class="board__no-tasks">
    Click «ADD NEW TASK» in menu to create your first task
  </p>`;
};

export default class NoTask {
  constructor() {
    this._element = null;
  }

  get template() {
    return createNoTaskTemplate();
  }

  get element() {
    if (!this._element) {
      this._element = createElement(this.template);
    }

    return this._element;
  }

  get removeElement() {
    this._element = null;
  }
}
