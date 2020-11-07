import { component, updateList, dispatch } from './html.js';
import { dropZone, dragAndDrop } from './drag-and-drop.js';
import * as todoItem from './todo-item.component.js';
import {
  addTodoItem,
  moveTodoItemToList,
  removeNamedList,
  changeNamedListName,
  moveNamedList,
} from '../state.js';

const template = /* html */ `
  <div class="todo-list named-list" draggable="true">
    <div class="controls">
      <button type="button" class="btn light todo-item-remove" data-todo-list-remove>&times;</button>
      <button type="button" class="btn light todo-item-drag" data-todo-list-drag>::::</button>
    </div>
    <input class="name" data-todo-list-title maxlength="16">
    <div class="todo-items-container">
      <ol class="todo-items"></ol>
      <input class="new-item" data-todo-list-new>
    </div>
  </div>
`;

export function update(prevState, nextState, el) {
  const prev = prevState?.data.todoLists?.find((list) => list.id === el.id);
  const next = nextState.data.todoLists.find((list) => list.id === el.id);

  el.querySelector('[data-todo-list-title]').value = next.name;

  updateList({
    element: el.querySelector('ol'),
    nextIds: next.items,
    prevIds: prev?.items,
    add: (id) => todoItem.create(id, nextState),
    update: (item) => todoItem.update(prevState, nextState, item),
  });
  return el;
}

export function create(id, state) {
  const el = update(undefined, state, component(id, template));

  dragAndDrop({
    element: el,
    handle: el.querySelector('[data-todo-list-drag]'),
    toText: (el) => el.querySelector('[data-todo-list-title]').value,
    name: 'application/todo-list',
    direction: 'horizontal',
    onMove: ({ moveId, overEnd }) => {
      dispatch(moveNamedList(moveId, el.id, overEnd), el);
    },
  });

  dropZone({
    element: el,
    name: 'application/todo-item',
    onDrop: ({ moveId }) => dispatch(moveTodoItemToList(moveId, el.id), el),
  });

  el.querySelector('[data-todo-list-new]').addEventListener('change', (event) => {
    dispatch(addTodoItem(el.id, event.target.value), el);
    event.target.value = '';
  });

  el.querySelector('[data-todo-list-remove]').addEventListener('click', () => {
    dispatch(removeNamedList(el.id), el);
  });

  el.querySelector('[data-todo-list-title]').addEventListener('change', (event) => {
    dispatch(changeNamedListName(el.id, event.target.value), el);
  });

  return el;
}
