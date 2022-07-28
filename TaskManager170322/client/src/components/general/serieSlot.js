import React, { useContext, useEffect, useRef, useState } from "react";
import ReadSerial from "./readSerial";
import Modal from "./modal";
import Message from "./message";

function SerieSlot(props) {
  const select = (e) => {
    let id = e.target.id;

    let copy = props.numbers.map((value) => {
      if (value.serie == id) {
        value.state = !value.state;
      } else {
      }
      return value;
    });

   // console.log(copy);
    props.setGlobals(props.numbers);
    props.setNumbers(copy);
  };

  return (
    <>
      <div className="serialNumber flex-row flex-between mcb-1">
        <div className="flex-col vw50">
          <div>{props.data.serie}</div>
          <div className="flex-row">
            <div>{"Lote " + props.data.lot}</div>
          </div>
        </div>

        <div className="vw20">{props.data.location}</div>
        <button
          id={props.data.serie}
          className="button-erase "
          onClick={select}
        >
          {props.data.state ? "Selected" : ""}
        </button>
      </div>
    </>
  );
}

export default SerieSlot;
