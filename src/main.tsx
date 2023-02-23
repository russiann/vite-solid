import { For } from "solid-js";
import { render } from "solid-js/web";
import { createMachine, assign } from "xstate";
import { useMachine } from "@xstate/solid";
import "./style.css";

type Item = { id: string; label: string };

type Context = {
  list: Item[];
};

type Events =
  | { type: "ADD_ITEM"; item: Item }
  | { type: "REMOVE_ITEM"; id: string };

const listMachine = createMachine(
  {
    id: "listMachine",
    schema: {
      context: {} as Context,
      events: {} as Events,
    },
    context: {
      list: [
        { id: "1", label: "Item 1" },
        { id: "2", label: "Item 2" },
        { id: "3", label: "Item 3" },
        { id: "4", label: "Item 4" },
        { id: "5", label: "Item 5" },
        { id: "6", label: "Item 6" },
      ],
    },
    initial: "idle",
    states: {
      idle: {
        on: {
          ADD_ITEM: {
            actions: "addItem",
          },
          REMOVE_ITEM: {
            actions: "removeItem",
          },
        },
      },
    },
  },
  {
    actions: {
      addItem: assign({
        list: (context, event) => {
          return context.list.concat(event.item);
        },
      }),
      removeItem: assign({
        list: (context, event) => {
          console.log("foo");
          return context.list.filter(
            (currentItem) => currentItem.id !== event.id
          );
        },
      }),
    },
  }
);

const App = () => {
  const [state, send] = useMachine(listMachine);

  return (
    <div>
      <For each={state.context.list}>
        {(item) => (
          <div>
            {item.label}{" "}
            <span onClick={() => send({ type: "REMOVE_ITEM", id: item.id })}>
              [DELETE]
            </span>
          </div>
        )}
      </For>
    </div>
  );
};

render(() => <App />, document.getElementById("app") as HTMLElement);
