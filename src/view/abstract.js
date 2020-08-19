import {createElement} from "../utils.js";

export default class Abstract {
  constructor() {
    if (new.target === Abstract) {
      throw new Error(`Can't instantiate Abstract, only concrete one.`);
    }

    this._element = null;
  }

  get template() {
    throw new Error(`Abstract method not implemented: template`);
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

