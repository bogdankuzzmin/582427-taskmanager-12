import AbstractView from "./abstract.js";

const createNoTaskTemplate = () => {
  return `<p class="board__no-tasks">
    Loading...
  </p>`;
};

export default class Loading extends AbstractView {
  get template() {
    return createNoTaskTemplate();
  }
}
