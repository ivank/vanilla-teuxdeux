import { TodoListElement } from './todo-list.js';

export class NamedListsElement extends HTMLElement {
  get data() {
    return this._data;
  }

  set data(data) {
    for (const item of data.items) {
      if (this._data.items.some((_item) => _item.id === item.id)) {
        this.querySelector(`#${item.id}`).data = item;
      } else {
        this.appendChild(new TodoListElement(item));
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
    this._data = { index: 0, items: [] };
    this.attachShadow({ mode: 'open' }).appendChild(
      document.getElementById('named-lists').content.cloneNode(true),
    );
    this.data = data ?? this._data;
  }

  connectedCallback() {
    this.shadowRoot.querySelector('#add-list').addEventListener('click', () => {
      this.dispatchEvent(
        new CustomEvent('action', {
          detail: { type: 'ADD_NAMED_LIST' },
          bubbles: true,
        }),
      );
    });
  }
}
