export class TodoListItemElement extends HTMLElement {
  get data() {
    return this._data;
  }

  set data(data) {
    this.setAttribute('id', data.id);
    this.classList.toggle('done', data.isDone);
    this.shadowRoot.querySelector('#text').innerText = data.text;
    this.shadowRoot.querySelector('#input').value = data.text;
    this._data = data;
  }

  constructor(data) {
    super();
    this.attachShadow({ mode: 'open' }).appendChild(
      document.getElementById('todo-list-item').content.cloneNode(true),
    );
    this.data = data;
  }

  connectedCallback() {
    this.shadowRoot.querySelector('#text').addEventListener('click', () => {
      this.dispatchEvent(
        new CustomEvent('action', {
          detail: { type: 'TOGGLE_TODO_ITEM_DONE', id: this.data.id, toggle: true },
          bubbles: true,
        }),
      );
    });
    this.shadowRoot.querySelector('#input').addEventListener('change', (event) => {
      if (event.target.value) {
        this.dispatchEvent(
          new CustomEvent('action', {
            detail: { type: 'CHANGE_TODO_ITEM_TEXT', id: this.data.id, text: event.target.value },
            bubbles: true,
          }),
        );
      } else {
        this.dispatchEvent(
          new CustomEvent('action', {
            detail: { type: 'REMOVE_TODO_ITEM', id: this.data.id },
            bubbles: true,
          }),
        );
      }
    });
  }
}
