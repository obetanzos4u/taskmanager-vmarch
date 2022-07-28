import Routes from "./components/general/routes";
import { StoreProvider, useStoreContext } from "./utils/taskState";
import { StoreAllProvider } from "./utils/allTask";
import { StoreSlotProvider } from "./utils/slotState";

function App() {
  return (
    <StoreSlotProvider>
      <StoreAllProvider>
        <StoreProvider>
          <Routes />
        </StoreProvider>
      </StoreAllProvider>
    </StoreSlotProvider>
  );
}

export default App;
