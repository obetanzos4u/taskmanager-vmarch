import React, { useContext, useEffect, useRef, useState } from "react";
import ReadSerial from "../general/readSerial";
import Modal from "./modal";
import Message from "./message";

function Serie(props) {
  const [numbers, setNumbers] = useState([]);
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
    }
  }, []);

  useEffect(() => {
    let object = numbers.map((element) => {
      return createSlot(element);
    });

    setRender(object);
  }, [numbers]);

  const add = () => {
    if (input.current.value != "") {
      if (numbers.length == 0) {
        addList(input.current.value);
      } else {
        var validation1 = numbers.filter((element) => {
          return element == input.current.value;
        });
        if (validation1 == 0) {
          addList(input.current.value);
        } else {
          sendMessage("error", "Ya se añadio el numero de serie");
        }
      }
    }
  };

  const addCode = (value) => {
    if (value != "") {
      if (numbers.length == 0) {
        addList(value);
      } else {
        var validation1 = numbers.filter((element) => {
          return element == value;
        });
        if (validation1 == 0) {
          addList(value);
        } else {
          //sendMessage("error", "Ya se añadio el numero de serie");
        }
      }
    }
  };

  const addList = (value) => {
    let buffer = numbers;
    buffer.push(value);
    setNumbers(buffer);
    let object = numbers.map((element) => {
      return createSlot(element);
    });

    setRender(object);
    input.current.value = "";
  };

  const erase = (e) => {
    e.preventDefault();
    let id = e.target.id;
    let buffer = numbers;
    buffer = buffer.filter((element) => {
      return element != id;
    });

    setNumbers(buffer);
  };

  const createSlot = (element) => {
    return (
      <div className="serialNumber flex-row flex-between ">
        <div>{element}</div>
        <button id={element} className="button-erase" onClick={erase}>
          Eliminar
        </button>
      </div>
    );
  };

  const save = () => {
    props.setSeries(numbers);
    if (numbers.length > 0) {
      props.setQuantity(numbers.length);
    }

    //props.test();
    props.close();
  };
  const exit = () => {
    props.close();
  };

  const openModal = (data) => {
    setScreen(data);
    setModal(true);
  };

  const closeModal = () => {
    setModal(false);
  };

  return (
    <div className="fullv flex-col flex-acenter p-2 fullp">
      <h1 className="title">Numeros de serie</h1>
      <button className="button-white" onClick={exit}>
        Salir
      </button>
      <input
        className="main_input m0"
        placeholder="Numero de serie"
        //dleInputChange}
        ref={input}
      />

      <div className="flex-row flex-between vw95 m0">
        <div>
          <button className="button-white" onClick={add}>
            Añadir
          </button>
          <button
            className="button-white"
            onClick={() =>
              openModal(
                <ReadSerial
                  setNumbers={setNumbers}
                  numbers={numbers}
                  close={closeModal}
                  add={addCode}
                />
              )
            }
          >
            Escaner
          </button>
        </div>
        <button className="button-white" onClick={save}>
          Guardar
        </button>
      </div>
      <div className="vw95 flex-jcenter flex-col m0" id="series">
        {render}
      </div>
      <Modal on={modal} type={screen} />
      {message}
    </div>
  );
}

export default Serie;
