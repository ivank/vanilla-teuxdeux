import { Component } from './component.js';
import { toggleTodoItemDone, changeTodoItemText, removeTodoItem } from './app.js';

export const template = /* html */ `
  <div>
    <span id="text">this is some content</span>
    <input type="text" id="input" />
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
    this.shadowRoot.querySelector('#input').addEventListener('change', (event) => {
      if (event.target.value) {
        this.dispatch(changeTodoItemText(this.id, event.target.value));
      } else {
        this.dispatch(removeTodoItem(this.id));
      }
    });
  }
}
