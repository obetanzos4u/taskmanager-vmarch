import React, { useEffect, useRef, useState } from "react";
import { useStoreContext } from "../../utils/taskState";
import { useStoreSlotContext } from "../../utils/slotState";
import API from "../../utils/api";
import { useStoreAllContext } from "../../utils/allTask";

function Manual(props) {
  const { currentTask } = useStoreContext();
  const { currentSlot } = useStoreSlotContext();
  const { operation } = useStoreAllContext();
  const loca = useRef();
  const lote = useRef();
  const quantity = useRef();
  const multiplier = useRef();
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    if (operation == "internal") {
      setEnabled(true);
    }
    multiplier.current.value = 1;

    quantity.current.value = props.currentQuantity;

    loca.current.value = props.loca;
    if (props.lote.hasOwnProperty("id")) {
      lote.current.value = props.lote.id;
    } else {
      lote.current.value = "";
    }
  }, []);

  const saveTask = () => {
    if (loca.current.value != "") {
      props.setLoca(loca.current.value);
    }
    if (props.lote.id != lote.current.value) {
      props.setlote({ id: lote.current.value });
    }
    if (quantity.current.value != "") {
      props.quantity(quantity.current.value * multiplier.current.value);
    }

    props.close();
  };

  const description = () => {
    let description = "";
    if (currentTask.ProductDescription) {
      description = currentTask.ProductDescription;
    } else {
      description = props.name;
    }
    return description;
  };

  return (
    <div className="flex-col flex-acenter child">
      <h1 className="title">Entrada Manual</h1>
      <div className="flex-row p-1 title2 clear2 p-2">
        <p className="">{props.name}</p>
      </div>
      <div>
        <div className="flex-row p-1 row">
          <p className="label">Pendiente: </p>{" "}
          <input
            disabled={true}
            className="border input-manual"
            value={props.open + " " + props.unit}
          />
        </div>
        <div className="flex-row p-1 row">
          <p className="label">Confirmado: </p>{" "}
          <input ref={quantity} className="border input-manual" />{" "}
        </div>
        <div className="flex-row p-1 row">
          <p className="label">Multiplicar: </p>{" "}
          <input
            ref={multiplier}
            className="border input-manual"
            type="number"
          />{" "}
        </div>
        <div className="flex-row p-1 row">
          <p className="label">Ubicacion: </p>{" "}
          <input
            ref={loca}
            disabled={enabled}
            className="border input-manual"
          />{" "}
        </div>
        <div className="flex-row p-1 row">
          <p className="label">Lote: </p>{" "}
          <input
            ref={lote}
            disabled={enabled}
            className="border input-manual"
          />{" "}
        </div>
        <div className="flex-row flex-center flex-around ">
          <button onClick={saveTask} className="button button-white ">
            Guardar
          </button>
          <button className="button button-white" onClick={props.close}>
            Cerrar
          </button>
        </div>
      </div>{" "}
    </div>
  );
}

export default Manual;
