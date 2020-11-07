import {
  fence,
  uid,
  addDays,
  update,
  mapOnlyId,
  set,
  flow,
  pull,
  pullId,
  map,
  append,
  insert,
  insertId,
} from './utils.js';

const initialData = {
  itemsWindow: 7,
  dailyLists: {
    currentDay: addDays(-1, new Date()),
    currentVisibleDay: addDays(-1, new Date()),
    items: [
      { id: 'td1', day: new Date() },
      { id: 'td2', day: new Date() },
      { id: 'td3', day: new Date() },
      { id: 'td4', day: new Date() },
      { id: 'td5', day: new Date() },
      { id: 'td6', day: new Date() },
    ],
  },
  todoItems: [
    {
      id: 'td1',
      text: 'watch [DIY videos on youtube](https://www.youtube.com/results?search_query=DIY)',
    },
    { id: 'td5', text: 'click to mark as done' },
    { id: 'td2', text: 'double click to edit' },
    { id: 'td3', text: 'write a long todo item that can span multiple lines' },
    { id: 'td4', text: 'edit to see **bold** and _italic_ things' },
    { id: 'td6', text: 'build a bear', isDone: true },
  ],
  todoLists: [
    { id: 'n1', name: 'books', items: [] },
    { id: 'n2', name: 'vacation', items: [] },
    { id: 'n3', name: 'ideas', items: [] },
    { id: 'n4', name: 'study', items: [] },
    { id: 'n5', name: 'movies and tv', items: [] },
    { id: 'n6', name: 'cars', items: [] },
  ],
  namedLists: {
    index: 0,
    isHidden: false,
    items: ['n1', 'n2', 'n3', 'n4', 'n5', 'n6'],
  },
};

export const initialState = {
  version: 1,
  data: initialData,
  previous: [initialData],
  index: 0,
};

export function serializeState(state) {
  return JSON.stringify(state);
}

export function deserializeState(state) {
  return JSON.parse(state, (key, value) =>
    ['currentDay', 'currentVisibleDay', 'day'].includes(key) ? new Date(value) : value,
  );
}

function saveState({ previous, index, data }) {
  return { data, previous: [...previous.slice(0, index + 1), data], index: index + 1 };
}

/**
 * Named lists
 */
export function toggleNamedLists() {
  return { type: 'TOGGLE_NAMED_LISTS' };
}

export function removeNamedList(id) {
  return { type: 'REMOVE_NAMED_LIST', id };
}

export function changeNamedListName(id, name) {
  return { type: 'CHANGE_NAMED_LIST_NAME', id, name };
}

export function addNamedList() {
  return { type: 'ADD_NAMED_LIST' };
}

export function moveNamedList(id, toId, overEnd) {
  return { type: 'MOVE_NAMED_LIST', id, toId, overEnd };
}

export function toNamedList(id) {
  return { type: 'TO_NAMED_LIST', id };
}

export function changeNamedListIndex(change) {
  return { type: 'CHANGE_NAMED_LIST_INDEX', change };
}

/**
 * Daily Lists
 */

export function changeDailyListsCurrentDay(dayChange) {
  return { type: 'CHANGE_DAILY_LISTS_CURRENT_DAY', dayChange };
}

/**
 * Todo Items
 */

export function toggleTodoItemDone(id, toggle) {
  return { type: 'TOGGLE_TODO_ITEM_DONE', id, toggle };
}

export function changeTodoItemText(id, text) {
  return { type: 'CHANGE_TODO_ITEM_TEXT', id, text };
}

export function moveTodoItemOnItem(id, toId, overEnd) {
  return { type: 'MOVE_TODO_ITEM_OVER_ITEM', id, toId, overEnd };
}

export function moveTodoItemToDay(id, day) {
  return { type: 'MOVE_TODO_ITEM_TO_DAY', id, day };
}

export function moveTodoItemToList(id, listId) {
  return { type: 'MOVE_TODO_ITEM_TO_LIST', id, listId };
}

export function removeTodoItem(id) {
  return { type: 'REMOVE_TODO_ITEM', id };
}

export function removeDailyTodoItem(id) {
  return { type: 'REMOVE_DAILY_TODO_ITEM', id };
}

export function addDailyTodoItem(day, text) {
  return { type: 'ADD_DAILY_TODO_ITEM', day, text };
}

export function addTodoItem(id, text) {
  return { type: 'ADD_TODO_ITEM', id, text };
}

/**
 * State
 */

export function clearState() {
  return { type: 'CLEAR_STATE' };
}

export function setPrevious(change) {
  return { type: 'SET_PREVIOUS', change };
}

export function init() {
  return { type: 'INIT' };
}

/**
 * Return a state transformer that would change previous state to next state
 *
 * Example:
 * ```javascript
 * const transfomer = reducer({ type: 'INIT });
 * const nextState = transfomer(previousState);
 * ```
 */
export function reducer(detail) {
  switch (detail.type) {
    case 'INIT':
      return flow(
        set('data.dailyLists.currentDay', addDays(-1, new Date())),
        set('data.dailyLists.currentVisibleDay', addDays(-1, new Date())),
      );

    case 'CLEAR_STATE':
      return () => initialState;

    case 'SET_PREVIOUS':
      return ({ previous, index }) => {
        const newIndex = fence(0, previous.length - 1, index + detail.change);
        return { data: previous[newIndex], previous, index: newIndex };
      };

    case 'TOGGLE_NAMED_LISTS':
      return update('data.namedLists.isHidden', (isHidden) => !isHidden);

    case 'CHANGE_NAMED_LIST_NAME':
      return flow(
        update('data.todoLists', mapOnlyId(detail.id, set('name', detail.name))),
        saveState,
      );

    case 'REMOVE_NAMED_LIST':
      return flow(
        update('data.todoLists', pullId(detail.id)),
        update('data.namedLists.items', pull(detail.id)),
        saveState,
      );

    case 'MOVE_NAMED_LIST':
      return flow(
        update(
          'data.namedLists.items',
          flow(pull(detail.id), insert(detail.id, detail.toId, detail.overEnd)),
        ),
        saveState,
      );

    case 'MOVE_TODO_ITEM_OVER_ITEM':
      return flow(
        update(
          'data.todoLists',
          map(
            update('items', flow(pull(detail.id), insert(detail.id, detail.toId, detail.overEnd))),
          ),
        ),
        update(
          'data.dailyLists.items',
          flow(
            pullId(detail.id),
            insertId((item) => ({ id: detail.id, day: item.day }), detail.toId, detail.overEnd),
          ),
        ),
        saveState,
      );

    case 'MOVE_TODO_ITEM_TO_DAY':
      return flow(
        update('data.todoLists', map(update('items', pull(detail.id)))),
        update('data.dailyLists.items', (items) => [
          ...pullId(detail.id)(items),
          { id: detail.id, day: detail.day },
        ]),
        saveState,
      );

    case 'MOVE_TODO_ITEM_TO_LIST':
      return flow(
        update('data.dailyLists.items', pullId(detail.id)),
        update(
          'data.todoLists',
          flow(
            map(update('items', pull(detail.id))),
            mapOnlyId(detail.listId, append('items', detail.id)),
          ),
        ),
        saveState,
      );

    case 'ADD_TODO_ITEM':
      const todoItem = { id: uid(), text: detail.text };
      return flow(
        append('data.todoItems', todoItem),
        update('data.todoLists', mapOnlyId(detail.id, append('items', todoItem.id))),
        saveState,
      );

    case 'ADD_DAILY_TODO_ITEM':
      const dayItem = { id: uid(), text: detail.text };
      return flow(
        append('data.todoItems', dayItem),
        append('data.dailyLists.items', { id: dayItem.id, day: detail.day }),
        saveState,
      );

    case 'ADD_NAMED_LIST':
      const todoList = { id: uid(), items: [], name: 'new list' };
      return flow(
        append('data.todoLists', todoList),
        append('data.namedLists.items', todoList.id),
        saveState,
      );

    case 'CHANGE_NAMED_LIST_INDEX':
      return update('data.namedLists', (namedLists) => {
        const index = fence(
          0,
          Math.max(0, namedLists.items.length - 5),
          namedLists.index + detail.change,
        );
        return set('index', index)(namedLists);
      });

    case 'TO_NAMED_LIST':
      return update('data.namedLists', (namedLists) => {
        const newIndex = namedLists.items.findIndex((id) => id === detail.id);
        const index = fence(
          0,
          Math.max(0, namedLists.items.length - 5),
          namedLists.index > newIndex ? newIndex : newIndex - 4,
        );
        return set('index', index)(namedLists);
      });

    case 'CHANGE_DAILY_LISTS_CURRENT_DAY':
      return update('data.dailyLists.currentDay', (day) => addDays(detail.dayChange, day));

    case 'TOGGLE_TODO_ITEM_DONE':
      return update('data.todoItems', mapOnlyId(detail.id, set('isDone', detail.toggle)));

    case 'CHANGE_TODO_ITEM_TEXT':
      return flow(
        update('data.todoItems', mapOnlyId(detail.id, set('text', detail.text))),
        saveState,
      );

    case 'REMOVE_TODO_ITEM':
      return flow(
        update('data.todoLists', map(update('items', pull(detail.id)))),
        update('data.dailyLists.items', pullId(detail.id)),
        update('data.todoItems', pullId(detail.id)),
        saveState,
      );
  }
}
