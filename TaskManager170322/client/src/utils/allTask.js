import React, { createContext, useReducer, useContext } from "react";

const INITIAL_STATE = {
  currentBlock: {},
  sapLabels: {},
  operation: "",
  user: "",
  isAdmin: false,
  site: "",
  units: [],
  employee: "",
};

const StoreContext = createContext(INITIAL_STATE);
const { Provider } = StoreContext;

const reducer = (state, action) => {
  switch (action.type) {
    case "GETINFO":
      return {
        ...state,
        currentBlock: action.data,
      };
    case "GETLABELS":
      return {
        ...state,
        sapLabels: action.data,
      };
    case "OPERATION":
      return {
        ...state,
        operation: action.data,
      };
    case "USER":
      return {
        ...state,
        user: action.data,
      };
    case "UNIT":
      return {
        ...state,
        units: action.data,
      };
    case "ADMIN":
      return {
        ...state,
        isAdmin: action.data,
      };
    case "SITE":
      return {
        ...state,
        site: action.data,
      };
    case "EMPLOYEE":
      return {
        ...state,
        employee: action.data,
      };

    default:
      return state;
  }
};

const StoreAllProvider = ({ value = [], ...props }) => {
  const [state, dispatch] = useReducer(reducer, INITIAL_STATE);

  const setAllTask = (info) => {
    dispatch({ type: "GETINFO", data: info });
  };

  const setLabels = (info) => {
    dispatch({ type: "GETLABELS", data: info });
  };
  const setOperation = (info) => {
    dispatch({ type: "OPERATION", data: info });
  };
  const setUser = (info) => {
    dispatch({ type: "USER", data: info });
  };
  const setUnits = (info) => {
    dispatch({ type: "UNIT", data: info });
  };
  const setAdmin = (info) => {
    dispatch({ type: "ADMIN", data: info });
  };
  const setSite = (info) => {
    dispatch({ type: "SITE", data: info });
  };
  const setEmployee = (info) => {
    dispatch({ type: "EMPLOYEE", data: info });
  };

  return (
    <Provider
      value={{
        currentBlock: state.currentBlock,
        sapLabels: state.sapLabels,
        operation: state.operation,
        user: state.user,
        units: state.units,
        site: state.site,
        isAdmin: state.isAdmin,
        employee: state.employee,
        setEmployee,
        setSite,
        setAdmin,
        setUnits,
        setUser,
        setOperation,
        setAllTask,
        setLabels,
      }}
      {...props}
    />
  );
};

const useStoreAllContext = () => {
  return useContext(StoreContext);
};

export { StoreAllProvider, useStoreAllContext };
