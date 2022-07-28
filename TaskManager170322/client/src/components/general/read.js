import React, { useEffect, useRef, useState } from "react";
import { useStoreAllContext } from "../../utils/allTask";
import Message from "../general/message";

import Quagga from "quagga";

import API from "../../utils/api";
import api from "../../utils/api";

function Read(props) {
  const [code, readCode] = useState();
  const { sapLabels } = useStoreAllContext();
  let result = 0;

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
    Quagga.init(
      {
        inputStream: {
          name: "Live",
          type: "LiveStream",
          target: document.querySelector("#canvas1"), // Or '#yourElement' (optional)
          constraints: {
            width: 480,
            height: 320,
            facingMode: "environment",
          },
        },

        decoder: {
          readers: ["code_128_reader", "upc_reader"],
          debug: {
            showCanvas: true,
            showPatches: true,
            showFoundPatches: true,
            showSkeleton: true,
            showLabels: true,
            showPatchLabels: true,
            showRemainingPatchLabels: true,
            boxFromPatches: {
              showTransformed: true,
              showTransformedBox: true,
              showBB: true,
            },
          },
        },
      },
      function (err) {
        if (err) {
         // console.log(err);
          return;
        }
        //console.log("Initialization finished. Ready to start");
        Quagga.start();
      }
    );

    var drawingCtx = Quagga.canvas.ctx.overlay,
      drawingCanvas = Quagga.canvas.dom.overlay;

    if (result) {
      if (result.boxes) {
        drawingCtx.clearRect(
          0,
          0,
          parseInt(drawingCanvas.getAttribute("width")),
          parseInt(drawingCanvas.getAttribute("height"))
        );
        result.boxes
          .filter(function (box) {
            return box !== result.box;
          })
          .forEach(function (box) {
            Quagga.ImageDebug.drawPath(box, { x: 0, y: 1 }, drawingCtx, {
              color: "green",
              lineWidth: 2,
            });
          });
      }

      if (result.box) {
        Quagga.ImageDebug.drawPath(result.box, { x: 0, y: 1 }, drawingCtx, {
          color: "#00F",
          lineWidth: 2,
        });
      }

      if (result.codeResult && result.codeResult.code) {
        Quagga.ImageDebug.drawPath(
          result.line,
          { x: "x", y: "y" },
          drawingCtx,
          { color: "red", lineWidth: 3 }
        );
      }
    }
  }, []);

  const close = () => {
    Quagga.stop();
    props.close();
  };

  Quagga.onDetected((e) => {
    //read code and stop
    let lastCode = e.codeResult.code;
    Quagga.offDetected();
    Quagga.stop();

    //if it is a sap code128 label
    if (lastCode.startsWith("97")) {
      lastCode = lastCode.substring(2);
      lastCode = parseInt(lastCode);
      readCode(lastCode);

      api
        .getLabel(lastCode)
        .then((response) => {
          if (
            response.data[0].MaterialMaterial.InternalID == props.data.ProductID
          ) {
            if (response.data[0] != null) {
              props.quantity(response.data[0].MaterialQuantity);
              props.unit(response.data[0].unitCode);
              props.set();
              props.close();
            } else {
              sendMessage("warning", "La etiqueta no coincide con el producto");
            }
          }
        })
        .catch((error) => {
          sendMessage("warning", "No hay resultados");
        });

      //console.log(id.MaterialMaterial.__deferred.uri);
    } else {
      //if it is an upc
      readCode(lastCode);

      API.getUpc(lastCode).then((upc) => {
        if (upc.data.length == 0) {
          sendMessage("warning", "No hay resultados");
        } else {
          //console.log(upc);
         // console.log(sapLabels);

          API.getLabel(props.data.ProductID).then((response) => {
            //console.log(response);
            /* let label2 = response.data.find((value) => {
              return (
                value.MaterialMaterial.InternalID == props.data.ProductID &&
                value.unitCode == upc.data[0].QuantityTypeCode
              ); */
            if (
              upc.data[0].QuantityTypeCode == props.unit ||
              props.currentQuantity == 0
            ) {
              if (props.data.ProductID == upc.data[0].Material.InternalID) {
                props.quantity(1 + props.currentQuantity);
                props.unit(upc.data[0].QuantityTypeCode);
                props.set();
                props.close();
              } else {
                sendMessage("warning", "El Id de producto no coincide");
              }
            } else {
              sendMessage("warning", "No hay etiquetas para este producto");
            }
          });
        }
      });
    }

    Quagga.offDetected();
    Quagga.stop();
  });

  return (
    <div className="modal-child flex-col flex-center p-2">
      <div></div>
      <input value={code} type="text" />
      <div>Quantity</div>
      <button className="button aqua3 border" onClick={() => close}>
        Close
      </button>
      <div className="drawingBuffers" id="canvas1"></div>
      {message}
      <div className="corner" onClick={() => close}>
        X
      </div>
    </div>
  );
}

export default Read;
