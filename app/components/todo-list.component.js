import { Component, updateList } from './component.js';
import { TodoListItemComponent } from './todo-list-item.component.js';
import { addTodoItem } from '../state.js';

const template = /* html */ `
  <div class="todo-list">
    <span>Title</span>
    <div>
      <div class="todo-items"></div>
      <input class="todo-list-new">
    </div>
  </div>
`;

export class TodoListComponent extends Component {
  update(prevState, nextState) {
    const prev = prevState?.todoLists?.find((list) => list.id === this._id);
    const next = nextState.todoLists.find((list) => list.id === this._id);

    this.querySelector(':scope > .todo-list > span').innerText = next.name;

    updateList({
      element: this.querySelector(':scope .todo-items'),
      nextIds: next.items,
      prevIds: prev?.items,
      add: (id) => new TodoListItemComponent(id, nextState),
      update: (item) => item.update(prevState, nextState),
    });
  }

  constructor(id, state) {
    super({ id, state, template });
  }

  connectedCallback() {
    this.querySelector(':scope input.todo-list-new').addEventListener('change', (event) => {
      this.dispatch(addTodoItem(this.id, event.target.value));
      event.target.value = '';
    });
  }
}
