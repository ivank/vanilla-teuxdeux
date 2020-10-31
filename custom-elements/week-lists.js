import { TodoListElement } from './todo-list.js';

function toWeekRange(from) {
  return Array.from(Array(7).keys()).map((day) => {
    const currentDay = new Date(from);
    currentDay.setDate(currentDay.getDate() + day);
    return currentDay;
  });
}

export class WeekListsElement extends HTMLElement {
  get data() {
    return this._data;
  }

  set data(data) {
    const dayLists = toWeekRange(data.currentDay).map((day) => ({
      id: `day-${day.getDate()}`,
      items: data.items.filter((item) => item.day.getDate() === day.getDate()),
    }));

    for (const item of dayLists) {
      if (this._data.some((_item) => _item.id === item.id)) {
        this.querySelector(`#${item.id}`).data = item;
      } else {
        this.appendChild(new TodoListElement(item));
      }
    }

    for (const _item of this._data) {
      if (data.every((item) => _item.id !== item.id)) {
        this.querySelector(`#${_item.id}`).remove();
      }
    }

    this._data = data;
  }

  constructor() {
    super();
    this.attachShadow({ mode: 'open' }).appendChild(
      document.getElementById('week-lists').content.cloneNode(true),
    );
    this._data = [];
  }

  connectedCallback() {
    this.shadowRoot.querySelector('#back').addEventListener('click', () => {
      this.dispatchEvent(
        new CustomEvent('action', {
          detail: { type: 'MOVE_BACK_DAILY_LISTS' },
          bubbles: true,
        }),
      );
    });

    this.shadowRoot.querySelector('#forward').addEventListener('click', () => {
      this.dispatchEvent(
        new CustomEvent('action', {
          detail: { type: 'MOVE_FORWARD_DAILY_LISTS' },
          bubbles: true,
        }),
      );
    });
  }
}
