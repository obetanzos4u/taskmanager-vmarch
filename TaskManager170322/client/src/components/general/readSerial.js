import React, { useEffect, useRef, useState } from "react";

import Quagga from "quagga";

import API from "../../utils/api";

function ReadSerial(props) {
  const [code, readCode] = useState();

  useEffect(() => {
    Quagga.init(
      {
        inputStream: {
          name: "Live",
          type: "LiveStream",
          target: document.querySelector("#canvas1"), // Or '#yourElement' (optional)
        },
        decoder: {
          readers: ["code_128_reader"],
        },
      },
      function (err) {
        if (err) {
          console.log(err);
          return;
        }
        //console.log("Initialization finished. Ready to start");
        Quagga.start();
      }
    );
  }, []);

  const close = () => {
    Quagga.stop();
    props.close();
  };
  Quagga.onDetected((e) => {
    let lastCode = e.codeResult.code;

    /* API.getUPC(lastCode).then((response) => {
      console.log(response.data);
    });*/

    let serie = lastCode;
    props.add(serie);

    close();
  });

  return (
    <div className="modal-child flex-col flex-center p-2">
      <div></div>
      <input value={code} type="text" />
      <div>Quantity</div>
      <button className="button aqua3 border" onClick={close}>
        Close
      </button>
      <div id="canvas1"></div>
    </div>
  );
}

export default ReadSerial;
