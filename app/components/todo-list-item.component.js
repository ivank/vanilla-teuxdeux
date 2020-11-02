import { Component } from './component.js';
import { toggleTodoItemDone, changeTodoItemText, removeTodoItem } from '../state.js';

export const template = /* html */ `
  <style>
    :host {
      height: 20px;
      overflow: hidden;
      position: relative;
    }
    .item {
      border-bottom: 1px solid gray;
    }
    button {
      display: none;
      position: absolute;
      top: 0;
      right: 0;
    }
    input {
      width: 100%;
      display: none;
    }
    .item.edited .text {
      display: none;
    }
    .item.edited input {
      display: block;
    }
    .item:hover {
      background-color: lightgray;
    }
    .item:hover button {
      display: block;
    }
  </style>
  <div class="item" id="item">
    <span class="text" id="text">this is some content</span>
    <input type="text" id="input">
    <button type="button" id="edit">Edit</button>
  </div>
`;

export class TodoListItemComponent extends Component {
  update(prevState, nextState) {
    const next = nextState.todoItems.find((item) => item.id === this.id);

    this.classList.toggle('done', next.isDone);
    this.shadowRoot.querySelector('#text').innerText = next.text;
    this.shadowRoot.querySelector('#input').value = next.text;
  }

  constructor(id, state) {
    super({ id, state, template });
  }

  connectedCallback() {
    this.shadowRoot.querySelector('#text').addEventListener('click', () => {
      this.dispatch(toggleTodoItemDone(this.id, true));
    });
    this.shadowRoot.querySelector('#edit').addEventListener('click', () => {
      this.shadowRoot.querySelector('#item').classList.toggle('edited', true);
      this.shadowRoot.querySelector('#input').select();
    });
    this.shadowRoot.querySelector('#input').addEventListener('change', (event) => {
      this.shadowRoot.querySelector('#item').classList.toggle('edited', false);
      if (event.target.value) {
        this.dispatch(changeTodoItemText(this.id, event.target.value));
      } else {
        this.dispatch(removeTodoItem(this.id));
      }
    });
  }
}
