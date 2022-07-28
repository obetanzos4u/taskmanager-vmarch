import React, { useEffect } from "react";
import { useStoreSlotContext } from "../../utils/slotState";
import { Link, useLocation } from "react-router-dom";

import { withRouter } from "react-router-dom";
import api from "../../utils/api";

function Slot(props) {
  const { setSlot } = useStoreSlotContext();
  const setTask = () => {
    setSlot(props.data);
    props.history.push("/task");
  };

  return (
    <>
      <div className="flex-row flex-between slot flex-center ">
        <div className=" flex-col fw p-1 ml-1">
          <div className="flex-row fw ml-1">
            <p className="text-center black-text p-1 flex-row">
              {"Tarea: "}
              {props.ide ? props.ide : null}
            </p>
            <p className="black-text p-1 ">
              {"Referencia: "}
              {props.reference ? props.reference : null}
            </p>
            <p className="black-text p-1">{"Items: " + props.items.length}</p>
          </div>

          <div className="flex-row ml-1">
            {" "}
            <p className="black-text p-1 flex-col">
              {"Socio Comercial: "}
              {props.socio ? props.socio : null}
            </p>
          </div>
        </div>

        <div className="buttons" onClick={setTask}>
          <a className="square-button1 fas fa-edit fa-2x"></a>
        </div>
      </div>
    </>
  );
}

export default withRouter(Slot);
