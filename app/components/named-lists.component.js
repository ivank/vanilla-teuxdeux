import { component, dispatch, updateList } from './component.js';
import { addNamedList, changeNamedListIndex } from '../state.js';
import * as todoList from './todo-list.component.js';

const template = /* html */ `
  <div class="named-lists">
    <div class="header">
      <button type="button" data-named-lists-add>Add List</button>
    </div>
    <div class="content">
      <div class="left-ui">
        <button type="button" data-named-lists-prev>Prev</button>
      </div>
      <div class="items" data-named-lists-items></div>
      <div class="right-ui">
        <button type="button" data-named-lists-next>Next</button>
      </div>
    </div>
  </div>
`;

export function update(prevState, nextState, el) {
  const prevIds = prevState?.namedLists?.items.slice(prevState.namedLists.index);
  const nextIds = nextState.namedLists.items.slice(nextState.namedLists.index);

  updateList({
    element: el.querySelector(':scope [data-named-lists-items]'),
    prevIds,
    nextIds,
    add: (id) => todoList.create(id, nextState),
    update: (item) => todoList.update(prevState, nextState, item),
  });

  return el;
}

export function create(id, state) {
  const el = update(undefined, state, component(id, template));

  el.querySelector(':scope [data-named-lists-add]').addEventListener('click', () => {
    dispatch(addNamedList(), el);
  });
  el.querySelector(':scope [data-named-lists-prev]').addEventListener('click', () => {
    dispatch(changeNamedListIndex(+1), el);
  });
  el.querySelector(':scope [data-named-lists-next]').addEventListener('click', () => {
    dispatch(changeNamedListIndex(-1), el);
  });

  return el;
}
