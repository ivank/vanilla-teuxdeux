import { fence, uid } from './utils.js';

export const initialState = {
  dailyLists: {
    currentDay: new Date('2020-01-01'),
    items: [
      { id: 'td1', day: new Date('2020-01-01') },
      { id: 'td2', day: new Date('2020-01-01') },
      { id: 'td3', day: new Date('2020-01-02') },
      { id: 'td4', day: new Date('2020-01-02') },
      { id: 'td5', day: new Date('2020-01-02') },
      { id: 'td6', day: new Date('2020-01-02') },
    ],
  },
  todoItems: [
    { id: 'td1', text: 'fist thing' },
    { id: 'td2', text: 'then second' },
    { id: 'td3', text: 'maybe clean' },
    { id: 'td4', text: 'fix comupter' },
    { id: 'td5', text: 'throw away trash' },
    { id: 'td6', text: 'build a bear', isDone: true },
    { id: 't1', text: 'asdasd', isDone: false },
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

export function changeDailyListsCurrentDay(dayChange) {
  return { type: 'CHANGE_DAILY_LISTS_CURRENT_DAY', dayChange };
}

export function reducer(state, detail) {
  switch (detail.type) {
    case 'MOVE_TODO_ITEM_OVER_ITEM': {
      return {
        ...state,
        todoLists: state.todoLists.map((list) => ({
          ...list,
          items: list.items
            .filter((id) => id !== detail.id)
            .reduce(
              (acc, id) =>
                acc.concat(
                  id === detail.toId ? (detail.overEnd ? [id, detail.id] : [detail.id, id]) : id,
                ),
              [],
            ),
        })),
        dailyLists: {
          ...state.dailyLists,
          items: state.dailyLists.items
            .filter((item) => item.id !== detail.id)
            .reduce(
              (acc, item) =>
                acc.concat(
                  item.id === detail.toId
                    ? detail.overEnd
                      ? [item, { id: detail.id, day: item.day }]
                      : [{ id: detail.id, day: item.day }, item]
                    : item,
                ),
              [],
            ),
        },
      };
    }

    case 'MOVE_TODO_ITEM_TO_DAY': {
      return {
        ...state,
        todoLists: state.todoLists.map((list) => ({
          ...list,
          items: list.items.filter((id) => id !== detail.id),
        })),
        dailyLists: {
          ...state.dailyLists,
          items: [
            ...state.dailyLists.items.filter((item) => item.id !== detail.id),
            { id: detail.id, day: detail.day },
          ],
        },
      };
    }

    case 'MOVE_TODO_ITEM_TO_LIST': {
      return {
        ...state,
        todoLists: state.todoLists.map((list) => ({
          ...list,
          items: list.items
            .filter((id) => id !== detail.id)
            .concat(list.id === detail.listId ? detail.id : []),
        })),
        dailyLists: {
          ...state.dailyLists,
          items: state.dailyLists.items.filter((item) => item.id !== detail.id),
        },
      };
    }

    case 'ADD_TODO_ITEM': {
      const todoItem = { id: uid(), text: detail.text };
      return {
        ...state,
        todoItems: [...state.todoItems, todoItem],
        todoLists: state.todoLists.map((list) =>
          list.id === detail.id ? { ...list, items: [...list.items, todoItem.id] } : list,
        ),
      };
    }

    case 'ADD_DAILY_TODO_ITEM': {
      const todoItem = { id: uid(), text: detail.text };
      return {
        ...state,
        todoItems: [...state.todoItems, todoItem],
        dailyLists: {
          ...state.dailyLists,
          items: [...state.dailyLists.items, { id: todoItem.id, day: detail.day }],
        },
      };
    }

    case 'ADD_NAMED_LIST': {
      const todoList = { id: uid(), items: [], name: 'new list' };
      return {
        ...state,
        todoLists: [...state.todoLists, todoList],
        namedLists: {
          ...state.namedLists,
          items: [...state.namedLists.items, todoList.id],
        },
      };
    }

    case 'CHANGE_NAMED_LIST_INDEX': {
      const index = fence(0, state.namedLists.items.length, state.namedLists.index + detail.change);
      return { ...state, namedLists: { ...state.namedLists, index } };
    }

    case 'CHANGE_DAILY_LISTS_CURRENT_DAY': {
      const currentDay = new Date(state.dailyLists.currentDay);
      currentDay.setDate(currentDay.getDate() + detail.dayChange);
      return { ...state, dailyLists: { ...state.dailyLists, currentDay } };
    }

    case 'TOGGLE_TODO_ITEM_DONE':
      return {
        ...state,
        todoItems: state.todoItems.map((item) =>
          item.id === detail.id ? { ...item, isDone: detail.toggle } : item,
        ),
      };

    case 'CHANGE_TODO_ITEM_TEXT': {
      return {
        ...state,
        todoItems: state.todoItems.map((item) =>
          item.id === detail.id ? { ...item, text: detail.text } : item,
        ),
      };
    }

    case 'REMOVE_TODO_ITEM': {
      return {
        ...state,
        todoLists: state.todoLists.map((list) => ({
          ...list,
          items: list.items.filter((id) => id !== detail.id),
        })),
        dailyLists: {
          ...state.dailyLists,
          items: state.dailyLists.items.filter((item) => item.id !== detail.id),
        },
        todoItems: state.todoItems.filter((item) => item.id !== detail.id),
      };
    }
  }
}
