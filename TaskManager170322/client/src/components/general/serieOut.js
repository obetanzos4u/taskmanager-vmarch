import React, { useContext, useEffect, useRef, useState } from "react";
import ReadSerial from "./readSerial";
import SerieSlot from "./serieSlot";
import Modal from "./modal";
import Message from "./message";
import api from "../../utils/api";
import { object } from "prop-types";
import { useStoreAllContext } from "../../utils/allTask";

function Serie(props) {
  const { site } = useStoreAllContext();
  const [numbers, setNumbers] = useState(props.numbers);
  const [render, setRender] = useState();
  const input = useRef();
  const [modal, setModal] = useState(false);
  const [screen, setScreen] = useState();

  ////////////////message handling

  const [message, setMessage] = useState(<Message />);
  const [messageState, setMessageStatus] = useState(false);

  const sendMessage = (type, text) => {
    setMessage(
      <Message on={true} type={type} text={text} timer={closeMessage} />
    );
    setMessageStatus(true);
  };

  const closeMessage = () => {
    setMessage(<Message />);
    setMessageStatus(false);
    clearTimeout();
  };
  //////////////////////

  useEffect(() => {
    if (props.series.length > 0) {
      setNumbers(props.series);
    } else {
      api.getSeries({ id: props.id, site: site }).then((response) => {
        let buffer = response.data.map((element) => {
          let lote = "";
          if (element.lot) {
            lote = element.lot;
          }
          if (element.ID != "") {
            let proto = {
              id: element.ProductInternalID,
              serie: element.SerialID,
              location: element.ID,
              state: false,
              lot: lote,
            };

            return proto;
          } else {
            return null;
          }
        });
        buffer = buffer.filter((value) => value != null);
       // console.log(buffer);
        setNumbers(buffer);
      });
    }
  }, []);
  useEffect(() => {
    props.setSeries(numbers);
  //  console.log(numbers);
  }, [numbers]);

  const save = () => {
    let count = numbers.filter((value) => {
      return value.state == true;
    });

   // console.log(count);
    //console.log(props.quantity);

    if (count.length > props.quantity) {
      sendMessage(
        "error",
        "La cantidad de series es mayor a la cantidad abierta"
      );
    } else {
      props.setSeries(count);
      props.setQuantity(count.length);
      props.close();
    }
  };

  const exit = () => {
    props.close();
  };

  return (
    <div className="fullv flex-col flex-acenter p-2 fullp">
      <h1 className="title">Numeros de serie</h1>
      <input
        className="main_input m0"
        placeholder="Numero de serie"
        //dleInputChange}
        ref={input}
      />

      <div className="flex-row flex-between vw95 m0">
        <button className="button-white" onClick={save}>
          Guardar
        </button>
        <button className="button-white" onClick={exit}>
          Salir
        </button>
      </div>
      <div className="vw95 flex-jcenter flex-col mcb-1 m0" id="series">
        {numbers.map((value) => {
          let slot = (
            <SerieSlot
              data={value}
              numbers={numbers}
              setSeries={props.setSeries}
              setNumbers={setNumbers}
              setGlobals={props.setNumbers}
            />
          );
          return slot;
        })}
      </div>
    </div>
  );
}

export default Serie;
