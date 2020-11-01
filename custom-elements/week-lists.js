import { TodoListComponent } from './todo-list.component.js';

function toWeekRange(from) {
  return Array.from(Array(7).keys()).map((day) => {
    const currentDay = new Date(from);
    currentDay.setDate(currentDay.getDate() + day);
    return currentDay;
  });
}

const template = /* html */ `
  <div>
    <slot></slot>
  </div>
  <button type="button" id="back">Back</button>
  <button type="button" id="forward">Forwad</button>
`;

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
        this.appendChild(new TodoListComponent(item));
      }
    }

    for (const _item of this._data) {
      if (data.every((item) => _item.id !== item.id)) {
        this.querySelector(`#${_item.id}`).remove();
      }
    }

    this._data = data;
  }

  constructor(state) {
    super({ id: 'week-lists', template, state });
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
