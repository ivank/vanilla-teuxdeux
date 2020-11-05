import { component, updateList, dispatch } from './component.js';
import * as todoItem from './todo-item.component.js';
import { addTodoItem, moveTodoItemToList, removeNamedList, changeNamedListName } from '../state.js';

const template = /* html */ `
  <div class="todo-list named-list" draggable>
    <div class="controls">
      <button type="button" class="btn todo-item-remove" data-todo-list-remove>&cross;</button>
      <button type="button" class="btn todo-item-drag" data-todo-list-drag>::::</button>
    </div>
    <input class="name" data-todo-list-title>
    <div class="todo-items-container">
      <ol class="todo-items"></ol>
      <input class="new-item" data-todo-list-new>
    </div>
  </div>
`;

export function update(prevState, nextState, el) {
  const prev = prevState?.todoLists?.find((list) => list.id === el.id);
  const next = nextState.todoLists.find((list) => list.id === el.id);

  el.querySelector(':scope [data-todo-list-title]').value = next.name;

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

  el.querySelector(':scope [data-todo-list-remove]').addEventListener('click', () => {
    dispatch(removeNamedList(el.id), el);
  });

  el.querySelector(':scope [data-todo-list-title]').addEventListener('change', (event) => {
    dispatch(changeNamedListName(el.id, event.target.value), el);
  });

  /**
   * Drag list
   */

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
