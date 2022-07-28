import React, { createContext, useReducer, useContext } from "react";

const INITIAL_STATE = {
  currentSlot: {},
};

const StoreContext = createContext(INITIAL_STATE);
const { Provider } = StoreContext;

const reducer = (state, action) => {
  switch (action.type) {
    case "SETSLOT":
      return {
        ...state,
        currentSlot: action.data,
      };

    default:
      return state;
  }
};

const StoreSlotProvider = ({ value = [], ...props }) => {
  const [state, dispatch] = useReducer(reducer, INITIAL_STATE);

  const setGlobalSlot = (info) => {
    dispatch({ type: "SETSLOT", data: info });
  };

  return (
    <Provider
      value={{ currentSlot: state.currentSlot, setSlot: setGlobalSlot }}
      {...props}
    />
  );
};

const useStoreSlotContext = () => {
  return useContext(StoreContext);
};

export { StoreSlotProvider, useStoreSlotContext };
