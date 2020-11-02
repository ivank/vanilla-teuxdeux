import { AppContainerElement } from './components/app-container.js';
import { NamedListsComponent } from './components/named-lists.component.js';
import { TodoListComponent } from './components/todo-list.component.js';
import { TodoListItemComponent } from './components/todo-list-item.component.js';
import { DayListComponent } from './components/day-list.component.js';
import { DailyListsComponent } from './components/daily-lists.component.js';

customElements.define('named-lists', NamedListsComponent);
customElements.define('daily-lists', DailyListsComponent);
customElements.define('day-list', DayListComponent);
customElements.define('todo-list', TodoListComponent);
customElements.define('todo-list-item', TodoListItemComponent);
customElements.define('app-container', AppContainerElement);
