import { component, updateList, dispatch } from './component.js';
import * as todoItem from './todo-item.component.js';
import { addTodoItem } from '../state.js';

const template = /* html */ `
  <div class="todo-list">
    <span data-todo-list-title>Title</span>
    <div>
      <ol class="todo-items"></ol>
      <input class="todo-list-new" data-todo-list-new>
    </div>
  </div>
`;

export function update(prevState, nextState, el) {
  const prev = prevState?.todoLists?.find((list) => list.id === el.id);
  const next = nextState.todoLists.find((list) => list.id === el.id);

  el.querySelector(':scope [data-todo-list-title]').innerText = next.name;

  updateList({
    element: el.querySelector(':scope ol'),
    nextIds: next.items,
    prevIds: prev?.items,
    add: (id) => todoItem.create(id, nextState),
    update: (item) => todoItem.update(prevState, nextState, item),
  });
  return el;
}

export function create(id, state) {
  const el = update(undefined, state, component(id, template));

  el.querySelector(':scope [data-todo-list-new]').addEventListener('change', (event) => {
    dispatch(addTodoItem(el.id, event.target.value), el);
    event.target.value = '';
  });
  return el;
}

// export class TodoListComponent extends Component {
//   update(prevState, nextState) {
//     const prev = prevState?.todoLists?.find((list) => list.id === this._id);
//     const next = nextState.todoLists.find((list) => list.id === this._id);

//     this.querySelector(':scope > .todo-list > span').innerText = next.name;

//     updateList({
//       element: this.querySelector(':scope .todo-items'),
//       nextIds: next.items,
//       prevIds: prev?.items,
//       add: (id) => todoItem.create(id, nextState),
//       update: (item) => todoItem.update(prevState, nextState, item),
//     });
//   }

//   constructor(id, state) {
//     super({ id, state, template });
//   }

//   connectedCallback() {
//     this.querySelector(':scope input.todo-list-new').addEventListener('change', (event) => {
//       this.dispatch(addTodoItem(this.id, event.target.value));
//       event.target.value = '';
//     });
//   }
// }
