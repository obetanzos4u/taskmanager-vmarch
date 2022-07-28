import React, { useEffect, useState } from "react";
import SquareLoader from "react-spinners/ClipLoader";
import { withRouter } from "react-router-dom";

function Signup(props) {
  const [modal, setModal] = useState();
  let [loading, setLoading] = useState(false);
  let [color, setColor] = useState("#ffffff");

  const cancelar = () => {
    setModal(null);
  };
  return (
    <>
      <div className="flex-col flex-center modal">
        <SquareLoader color={color} loading={loading} size={150} />
        <div className="flex-col box">
          <div className="flex-col">
            <label>User</label>
            <input type="text" />
            <label>Password</label>
            <input type="password" />
            <label>Repeat password</label>
            <input type="password" />
          </div>
          <div className="flex-row">
            <div className="button-withe">Crear</div>
            <div className="button-withe" onClick={props.cancel}>
              Cancelar
            </div>
          </div>
        </div>
        {modal}
      </div>
    </>
  );
}

export default withRouter(Signup);
