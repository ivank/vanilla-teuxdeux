import { TodoListItemElement } from './todo-list-item.js';

const dateFormat = new Intl.DateTimeFormat('en-US');

export class DailyListElement extends HTMLElement {
  get data() {
    return this._data;
  }

  set data(data) {
    this.setAttribute('id', data.id);
    this.shadowRoot.querySelector('#title').innerText = dateFormat
      .formatToParts(data.day)
      .find((part) => part.type === 'weekday')?.value;

    for (const item of data.items) {
      if (this._data.items.some((_item) => _item.id === item.id)) {
        this.querySelector(`#${item.id}`).data = item;
      } else {
        this.appendChild(new TodoListItemElement(item));
      }
    }

    for (const _item of this._data.items) {
      if (data.items.every((item) => _item.id !== item.id)) {
        this.querySelector(`#${_item.id}`).remove();
      }
    }

    this._data = data;
  }

  constructor(data) {
    super();
    this._data = { items: [] };
    this.attachShadow({ mode: 'open' }).appendChild(
      document.getElementById('daily-list').content.cloneNode(true),
    );
    this.data = data;
  }

  connectedCallback() {
    this.shadowRoot.querySelector('#add-item').addEventListener('click', () => {
      this.dispatchEvent(
        new CustomEvent('action', {
          detail: { type: 'ADD_TODO_ITEM', id: this.data.id },
          bubbles: true,
        }),
      );
    });
  }
}
