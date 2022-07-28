import React, { useContext, useEffect, useRef, useState } from "react";
import ReadSerial from "./readSerial";
import SerieSlot from "./serieSlot";
import Modal from "./modal";
import Message from "./message";
import api from "../../utils/api";
import { object } from "prop-types";
import { useStoreAllContext } from "../../utils/allTask";
import SquareLoader from "react-spinners/ClipLoader";

function Stock(props) {
  const { site } = useStoreAllContext();
  const [stock, setStock] = useState([]);
  let [loading, setLoading] = useState(true);
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

  useEffect(() => {
    if (props.stock.length == 0) {
      api
        .getStock({ material: props.id, site: site })
        .then((response) => {
          if (response.data) {
            props.setStock(response.data);
            console.log(response.data);
            setStock(response.data);
            setLoading(false);
          } else {
            sendMessage("warning", "no hay stock en el sitio " + site);
          }
        })
        .catch((err) => {
          sendMessage("error", err);
        });
    } else {
      setStock(props.stock);
      setLoading(false);
    }
  }, []);

  return (
    <div className="fullv flex-col flex-acenter p-2 fullp">
      <h1 className="title">Stock</h1>
      <div className="flex-col flex-acenter p-1 title2 clear2 p-2">
        <p className="">{props.name}</p>
        <button className="button button-white" onClick={props.close}>
          Cerrar
        </button>
      </div>

      <div className="flex-row">
        <div className="stockt p-1">Almacen</div>
        <div className="stockt2 p-1 text-center">Ubicación/Lote</div>
        <div className="stockt p-1 flex-row">Cantidad</div>
      </div>
      <SquareLoader
        className="child"
        color={color}
        loading={loading}
        size={150}
      />
      {stock.length > 0
        ? stock.map((element) => {
            let object = (
              <div className="card flex-row  mcb-1">
                <div className="stock p-1 wh">{element.TIML_UUID}</div>
                <div className="flex-col stock2">
                  {" "}
                  <div className="text-center">
                    {element.CLOG_AREA_UUID.split("/")[1]}
                  </div>
                  <div className="text-center">
                    {element.C1ISTOCK_UUIDsISTOCK_ID}
                  </div>
                </div>
                <div className="stock p-1 flex-row">
                  <div className="text-center">
                    {Number(element.KCON_HAND_STOCK)}
                    {" -"}
                  </div>
                  <div className="text-center">
                    {" "}
                    {element.TON_HAND_STOCK_UOM}
                  </div>
                </div>
              </div>
            );
            return object;
          })
        : null}
    </div>
  );
}

export default Stock;
