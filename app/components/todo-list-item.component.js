import { Component } from './component.js';
import { toggleTodoItemDone, changeTodoItemText, removeTodoItem } from '../state.js';

export const template = /* html */ `
  <div class="todo-list-item">
    <span class="text">this is some content</span>
    <input type="text">
    <button type="button">Edit</button>
  </div>
`;

export class TodoListItemComponent extends Component {
  update(prevState, nextState) {
    const next = nextState.todoItems.find((item) => item.id === this.id);

    this.classList.toggle('done', next.isDone);
    this.querySelector(':scope .text').innerText = next.text;
    this.querySelector(':scope input').value = next.text;
  }

  constructor(id, state) {
    super({ id, state, template });
  }

  connectedCallback() {
    this.querySelector(':scope .text').addEventListener('click', () => {
      this.dispatch(toggleTodoItemDone(this.id, true));
    });
    this.querySelector(':scope button').addEventListener('click', () => {
      this.querySelector(':scope > .todo-list-item').classList.toggle('edited', true);
      this.querySelector(':scope input').select();
    });
    this.querySelector(':scope input').addEventListener('change', (event) => {
      this.querySelector(':scope > .todo-list-item').classList.toggle('edited', false);
      if (event.target.value) {
        this.dispatch(changeTodoItemText(this.id, event.target.value));
      } else {
        this.dispatch(removeTodoItem(this.id));
      }
    });
  }
}
