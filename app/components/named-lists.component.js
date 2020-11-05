import { component, dispatch, updateList } from './component.js';
import { addNamedList, changeNamedListIndex, toggleNamedLists } from '../state.js';
import * as todoList from './todo-list.component.js';
import * as todoListIndex from './todo-list-index.component.js';

const template = /* html */ `
  <div class="todo-lists">
    <div class="header">
      <div class="start">
        <button type="button" class="btn toggle" data-named-lists-toggle>&#8963;</button>
      </div>
      <div class="center" data-named-lists-index></div>
      <div class="end">
        <button type="button" class="btn add" data-named-lists-add>+</button>
      </div>
    </div>
    <div class="content" data-named-lists-content>
      <div class="left-ui">
        <button type="button" class="btn" data-named-lists-prev>&lsaquo;</button>
      </div>
      <div class="items-container">
        <div class="items" data-named-lists-items></div>
      </div>
      <div class="right-ui">
        <button type="button" class="btn" data-named-lists-next>&rsaquo;</button>
      </div>
    </div>
  </div>
`;

export function update(prevState, nextState, el) {
  el.querySelector(':scope [data-named-lists-toggle]').classList.toggle(
    'is-active',
    !nextState.namedLists.isHidden,
  );

  el.querySelector(':scope [data-named-lists-content]').classList.toggle(
    'is-hidden',
    nextState.namedLists.isHidden,
  );

  el.querySelector(':scope [data-named-lists-prev]').toggleAttribute(
    'disabled',
    nextState.namedLists.index <= 0,
  );
  el.querySelector(':scope [data-named-lists-next]').toggleAttribute(
    'disabled',
    nextState.namedLists.index >= nextState.namedLists.items.length - 7,
  );

  const prevIds = prevState?.namedLists?.items.slice(
    prevState.namedLists.index,
    prevState.namedLists.index + 7,
  );
  const nextIds = nextState.namedLists.items.slice(
    nextState.namedLists.index,
    nextState.namedLists.index + 7,
  );

  updateList({
    element: el.querySelector(':scope [data-named-lists-items]'),
    prevIds,
    nextIds,
    add: (id) => todoList.create(id, nextState),
    update: (item) => todoList.update(prevState, nextState, item),
  });

  const prevIdsIndex = prevState?.namedLists?.items;
  const nextIdsIndex = nextState.namedLists.items;

  updateList({
    element: el.querySelector(':scope [data-named-lists-index]'),
    prevIds: prevIdsIndex,
    nextIds: nextIdsIndex,
    add: (id) => todoListIndex.create(id, nextState),
    update: (item) => todoListIndex.update(prevState, nextState, item),
  });

  return el;
}

export function create(id, state) {
  const el = update(undefined, state, component(id, template));

  el.querySelector(':scope [data-named-lists-toggle]').addEventListener('click', () => {
    dispatch(toggleNamedLists(), el);
  });

  el.querySelector(':scope [data-named-lists-add]').addEventListener('click', () => {
    dispatch(addNamedList(), el);
  });

  el.querySelector(':scope [data-named-lists-prev]').addEventListener('click', () => {
    dispatch(changeNamedListIndex(-1), el);
  });

  el.querySelector(':scope [data-named-lists-next]').addEventListener('click', () => {
    dispatch(changeNamedListIndex(+1), el);
  });

  return el;
}
