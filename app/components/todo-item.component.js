import { component, dispatch } from './component.js';
import { toggleTodoItemDone, changeTodoItemText, removeTodoItem } from '../state.js';

export const template = /* html */ `
  <li class="todo-item">
    <span class="text" data-item-text>this is some content</span>
    <input type="text" data-item-input>
    <button type="button" data-item-edit>Edit</button>
  </li>
`;

export function update(prevState, nextState, el) {
  const next = nextState.todoItems.find((item) => item.id === el.id);

  el.classList.toggle('done', next.isDone);
  el.querySelector(':scope [data-item-text]').innerText = next.text;
  el.querySelector(':scope [data-item-input]').value = next.text;
  return el;
}

export function create(id, state) {
  const el = update(undefined, state, component(id, template));

  el.querySelector(':scope [data-item-text]').addEventListener('click', () => {
    dispatch(toggleTodoItemDone(el.id, true), el);
  });
  el.querySelector(':scope [data-item-edit]').addEventListener('click', () => {
    el.classList.toggle('edited', true);
    el.querySelector(':scope [data-item-input]').select();
  });
  el.querySelector(':scope [data-item-input]').addEventListener('change', (event) => {
    el.classList.toggle('edited', false);
    if (event.target.value) {
      dispatch(changeTodoItemText(el.id, event.target.value), el);
    } else {
      dispatch(removeTodoItem(el.id), el);
    }
  });

  return el;
}
