import { moveIndex } from '../utils.js';

export function updateList({ prevIds = [], nextIds = [], add, update, element }) {
  prevIds.forEach((prevId) => {
    if (nextIds.every((nextId) => prevId !== nextId)) {
      element.querySelector(`#${prevId}`).remove();
    }
  });

  let prevIdsFiltered = prevIds.filter((prevId) => nextIds.some((nextId) => prevId === nextId));
  let current = Array.from(element.querySelectorAll(':scope > *'));

  nextIds.forEach((nextId, nextIndex) => {
    const prevIndex = prevIdsFiltered.findIndex((prevId) => prevId === nextId);
    const prevId = prevIndex !== -1 ? prevIdsFiltered[prevIndex] : undefined;

    if (prevId) {
      const updatedItem = element.querySelector(`#${nextId}`);
      update(updatedItem);
      if (prevIndex !== nextIndex && current[nextIndex]) {
        element.insertBefore(updatedItem, current[nextIndex]);
        current = moveIndex(prevIndex, nextIndex, current);
        prevIdsFiltered = moveIndex(prevIndex, nextIndex, prevIdsFiltered);
      }
    } else {
      const newItem = add(nextId);
      if (current[nextIndex]) {
        element.insertBefore(newItem, current[nextIndex]);
      } else {
        element.appendChild(newItem);
      }
    }
  });
}

export class Component extends HTMLElement {
  update() {}

  get id() {
    return this._id;
  }

  dispatch(detail) {
    if (detail.type) {
      this.dispatchEvent(new CustomEvent('action', { detail, bubbles: true }));
    } else {
      detail((detail) => this.dispatchEvent(new CustomEvent('action', { detail, bubbles: true })));
    }
  }

  constructor({ template, state, id }) {
    super();
    this._id = id;
    this.setAttribute('id', id);
    if (template) {
      this.innerHTML = template;
    }
    if (state) {
      this.update(undefined, state);
    }
  }
}
