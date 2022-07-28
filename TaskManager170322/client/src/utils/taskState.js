import React, { createContext, useReducer, useContext } from "react";

const INITIAL_STATE = {
  currentTask: {},
  globalItems: [],
  pedimento: "",
};

const StoreContext = createContext(INITIAL_STATE);
const { Provider } = StoreContext;

const reducer = (state, action) => {
  switch (action.type) {
    case "SETTASK":
      return {
        ...state,
        currentTask: action.data,
      };
    case "SETGLOBALITEMS":
      return {
        ...state,
        globalItems: action.data,
      };
    case "SETPEDIMENTO":
      return {
        ...state,
        pedimento: action.data,
      };

    default:
      console.log(state);
      return state;
  }
};

const StoreProvider = ({ value = [], ...props }) => {
  const [state, dispatch] = useReducer(reducer, INITIAL_STATE);

  const setGlobalTask = (info) => {
    dispatch({ type: "SETTASK", data: info });
  };
  const setGlobalItems = (info) => {
    dispatch({ type: "SETGLOBALITEMS", data: info });
  };
  const setPedimento = (info) => {
    dispatch({ type: "SETPEDIMENTO", data: info });
  };

  return (
    <Provider
      value={{
        currentTask: state.currentTask,
        globalItems: state.globalItems,
        pedimento: state.pedimento,
        setPedimento,
        set: setGlobalTask,
        setGlobalItems,
      }}
      {...props}
    />
  );
};

const useStoreContext = () => {
  return useContext(StoreContext);
};

export { StoreProvider, useStoreContext };
