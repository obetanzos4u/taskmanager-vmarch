import React from "react";
import { useStoreAllContext } from "../../utils/allTask";

function MainMenu(props) {
  const {
    setAllTask,
    currentBlock,
    setLabels,
    sapLabels,
    operation,
    setOperation,
    user,
    setUser,
  } = useStoreAllContext();
 // console.log(currentBlock);
  const handleInputChange = (event) => {
    const { value } = event.target;

    var copy = currentBlock;

    if (operation == "internal") {
      if (value == "") {
        props.setTask(copy);
      } else {
        var filtered = currentBlock.filter((tarea) => {
          if (tarea.SiteLogisticsTaskID.includes(value)) {
            return tarea;
          }
        });

        props.setTask(filtered);
      }
    } else {
      if (value == "") {
        props.setTask(copy);
      } else {
        var filtered = currentBlock.filter((tarea) => {
          if (
            tarea.BusinessTransactionDocumentReferenceID.toLowerCase().includes(
              value.toLowerCase()
            ) ||
            tarea.CustomerParty.CustomerPartyName.toLowerCase().includes(
              value.toLowerCase()
            )
          ) {
            return tarea;
          }
        });

        props.setTask(filtered);
      }
    }
  };
  return (
    <>
      <div className="flex-col flex-between">
        <div className="flex-row flex-between p-3">
          <div>
            <i
              className="fas fa-door-closed fa-2x"
              onClick={() => props.logout()}
            />{" "}
          </div>
          <h1> Task Manager </h1>
          <div>
            <i className="fas fa-sync fa-2x" onClick={props.reload} />{" "}
          </div>
        </div>
        <div className="flex-row">
          <a onClick={props.in} className="menu-button">
            Entradas
          </a>
          <a onClick={props.out} className="menu-button">
            Salidas
          </a>
          <a onClick={props.int} className="menu-button">
            Internos
          </a>
        </div>
        <div className="flex-center">
          <input
            className="main_input"
            placeholder="Pedido o socio comercial"
            onChange={handleInputChange}
          />
        </div>
      </div>
    </>
  );
}

export default MainMenu;
