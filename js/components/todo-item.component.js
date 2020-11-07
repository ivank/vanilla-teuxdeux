import { component, dispatch, markdownToHtml } from './html.js';
import {
  toggleTodoItemDone,
  moveTodoItemOnItem,
  changeTodoItemText,
  removeTodoItem,
} from '../state.js';
import { dragAndDrop } from './drag-and-drop.js';

export const template = /* html */ `
  <li class="todo-item" draggable="true">
    <div class="text" data-item-text>this is some content</div>
    <input type="text" data-item-input>
    <button type="button" class="btn light todo-item-edit" data-item-edit title="Edit todo item text">
      &#9998;
    </button>
    <button type="button" class="btn light todo-item-remove" data-item-remove title="Remove todo item">
      &times;
    </button>
  </li>
`;

export function update(prevState, nextState, el) {
  const next = nextState.data.todoItems.find((item) => item.id === el.id);
  el.isDone = next.isDone;
  el.classList.toggle('is-done', Boolean(next.isDone));
  el.classList.remove('is-drag', 'is-dragover');
  el.querySelector('[data-item-text]').innerHTML = markdownToHtml(next.text);
  el.querySelector('[data-item-input]').value = next.text;
  return el;
}

export function create(id, state) {
  const el = update(undefined, state, component(id, template));

  const text = el.querySelector('[data-item-text]');
  const edit = el.querySelector('[data-item-edit]');
  const remove = el.querySelector('[data-item-remove]');
  const input = el.querySelector('[data-item-input]');

  dragAndDrop({
    element: el,
    toText: (el) => el.querySelector('[data-item-input]').value,
    name: 'application/todo-item',
    direction: 'vertical',
    onMove: ({ moveId, overEnd }) => dispatch(moveTodoItemOnItem(moveId, el.id, overEnd), el),
  });

  text.addEventListener('click', (event) => {
    if (event.target === text) {
      dispatch(toggleTodoItemDone(el.id, !el.isDone), el);
    }
  });

  text.addEventListener('dblclick', () => {
    el.classList.toggle('is-edit', true);
    el.querySelector('[data-item-input]').select();
  });

  remove.addEventListener('click', () => {
    dispatch(removeTodoItem(el.id), el);
  });

  edit.addEventListener('click', () => {
    el.classList.toggle('is-edit', true);
    el.querySelector('[data-item-input]').select();
  });

  input.addEventListener('blur', () => {
    el.classList.toggle('is-edit', false);
  });

  input.addEventListener('change', (event) => {
    el.classList.toggle('is-edit', false);
    if (event.target.value) {
      dispatch(changeTodoItemText(el.id, event.target.value), el);
    } else {
      dispatch(removeTodoItem(el.id), el);
    }
  });

  return el;
}
