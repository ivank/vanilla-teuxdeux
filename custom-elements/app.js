import { fence, uid, flow, append, mapOnlyId, set, update, map, pull, pullId } from './utils.js';

export const initialState = {
  weekLists: {
    currentDay: new Date('2020-01-01'),
    items: [
      { id: 't4', day: new Date('2020-01-01') },
      { id: 't5', day: new Date('2020-01-01') },
    ],
  },
  todoItems: [
    { id: 't4', text: 'asdasd', day: new Date('2020-01-01'), isDone: false, isEdit: true },
    { id: 't5', text: 'sdfxcv', day: new Date('2020-01-01'), isDone: true },
    { id: 't1', text: 'asdasd', isDone: false, isEdit: true },
    { id: 't2', text: 'sdfxcv', isDone: true },
    { id: 't3', text: 'asdasd', isDone: false },
    { id: 't4', text: 'sdfxcv', isDone: true },
    { id: 't5', text: 'asd123', isDone: false },
  ],
  todoLists: [
    { id: 'n1', name: 'list 1', items: ['t1', 't2'] },
    { id: 'n2', name: 'list 2', items: ['t3', 't4'] },
    { id: 'n3', name: 'list 3', items: ['t5'] },
  ],
  namedLists: {
    index: 0,
    items: ['n1', 'n2', 'n3'],
  },
};

export function addNamedList() {
  return { type: 'ADD_NAMED_LIST' };
}

export function changeNamedListIndex(change) {
  return { type: 'CHANGE_NAMED_LIST_INDEX', change };
}

export function toggleTodoItemDone(id, toggle) {
  return { type: 'TOGGLE_TODO_ITEM_DONE', id, toggle };
}

export function changeTodoItemText(id, text) {
  return { type: 'CHANGE_TODO_ITEM_TEXT', id, text };
}

export function removeTodoItem(id) {
  return { type: 'REMOVE_TODO_ITEM', id };
}

export function addTodoItem(id) {
  return { type: 'ADD_TODO_ITEM', id };
}

export function changeWeekListsCurrentDay(day) {
  return { type: 'CHANGE_WEEK_LISTS_CURRENT_DAY', day };
}

export function toReduceer(detail) {
  switch (detail.type) {
    case 'ADD_TODO_ITEM':
      const todoItem = { id: uid(), text: 'newly added' };
      return flow(
        append('todoItems', todoItem),
        update('todoLists', mapOnlyId(detail.id, append('items', todoItem.id))),
      );

    case 'ADD_NAMED_LIST':
      const todoList = { id: uid(), items: [], name: 'new list' };
      return flow(append('todoLists', todoList), append('namedLists.items', todoList.id));

    case 'CHANGE_NAMED_LIST_INDEX': {
      return update('namedLists', (lists) =>
        update(
          'index',
          fence(0, state.namedLists.items.length, state.namedLists.index + detail.change),
        )(lists),
      );
    }

    case 'CHANGE_WEEK_LISTS_CURRENT_DAY':
      return set('weekLists.currentDay', detail.day);

    case 'TOGGLE_TODO_ITEM_DONE':
      return update('todoItems', mapOnlyId(detail.id, set('isDone', detail.toggle)));

    case 'CHANGE_TODO_ITEM_TEXT':
      return update('todoItems', mapOnlyId(detail.id, set('text', detail.text)));

    case 'REMOVE_TODO_ITEM':
      return flow(
        update('todoLists', map(update('items', pull(detail.id)))),
        update('todoItems', pullId(detail.id)),
      );
  }
}
