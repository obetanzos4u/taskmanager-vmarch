import React, { useEffect, useRef, useState } from "react";
import { useStoreContext } from "../../utils/taskState";
import { useStoreSlotContext } from "../../utils/slotState";
import API from "../../utils/api";
import SquareLoader from "react-spinners/ClipLoader";
import Message from "../general/message";

function Lote(props) {
  const { currentTask, pedimento, setPedimento } = useStoreContext();
  let [loading, setLoading] = useState(false);
  let [color, setColor] = useState("#ffffff");

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

  const id = useRef();
  const externalId = useRef();
  const product = useRef();
  const description = useRef();

  const saveBin = () => {
    setLoading(true);
    let data = {
      id: id.current.value,
      externalId: externalId.current.value,
      product: props.data.ProductID,
      description: description.current.value,
    };

    API.postLote(data)
      .then((response) => {
        if (data.id == "") {
          data.id = response.data.IdentifiedStockResponse[0].IdentifiedStockID;
        }
        props.setLote(data);
        setPedimento(data.externalId);

        if (response.data.hasOwnProperty("Log")) {
          setLoading(false);
          sendMessage("warning", response.data.Log.Item[0].Note);
        } else {
         // console.log(response.data);
          if (response.data.statusCode == 401) {
            setLoading(false);
            sendMessage("error", "Error de conexion");
          } else {
            setLoading(false);
            props.close();
          }
        }
        //sendMessage("warning", response.data.Log.Item[0].Note);
      })
      .catch((error) => {
        //sendMessage("warning", error.Log.Item[0].Note);
        sendMessage("error", "Error");
        setLoading(false);
      });
  };

  useEffect(() => {
    if (props.lote.hasOwnProperty("id")) {
      id.current.value = props.lote.id;
    }
    if (props.lote.externalId) {
      externalId.current.value = props.lote.externalId;
    }
    if (props.lote.description) {
      description.current.value = props.lote.description;
    }
  }, []);

  const descriptionItem = () => {
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
      <h1 className="title">Entrada de lote</h1>
      <div className="flex-row title2 clear2 ">
        <p className="">{props.data.ProductID + descriptionItem()}</p>
      </div>
      {loading ? (
        <SquareLoader
          className="fullv"
          color={color}
          loading={loading}
          size={150}
        />
      ) : (
        <>
          <div className="flex-row p-1 row">
            <p className="label">Lote: </p> <input ref={id} />
          </div>
          <div className="flex-row p-1 row">
            <p className="label">Description: </p>{" "}
            <input ref={description} className="border" />{" "}
          </div>
          <div className="flex-row p-1 row">
            <p className="label">Pedimento: </p>{" "}
            <input type="number" ref={externalId} className="border" />{" "}
          </div>
          <div className="flex-row flex-center flex-around fw">
            <button onClick={saveBin} className="button button-white">
              Guardar
            </button>
            <button className="button button-white" onClick={props.close}>
              Cerrar
            </button>
          </div>
        </>
      )}
      {message}
    </div>
  );
}

export default Lote;
