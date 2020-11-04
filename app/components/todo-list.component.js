import { component, updateList, dispatch } from './component.js';
import * as todoItem from './todo-item.component.js';
import { addTodoItem, moveTodoItemToList } from '../state.js';

const template = /* html */ `
  <div class="todo-list">
    <span data-todo-list-title>Title</span>
    <div class="todo-items-container">
      <ol class="todo-items"></ol>
      <input class="new-item" data-todo-list-new>
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

  /**
   * Drag items from different lists / days
   */

  el.addEventListener('drop', (event) => {
    dispatch(moveTodoItemToList(event.dataTransfer.getData('application/todo-id'), el.id), el);
    event.preventDefault();
  });

  el.addEventListener('dragover', (event) => {
    event.preventDefault();
  });

  return el;
}
