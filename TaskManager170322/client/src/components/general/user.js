import React, { useEffect, useState } from "react";
import { withRouter } from "react-router-dom";
import api from "../../utils/api";

function User(props) {
  const deleteUser = () => {
    api.deleteUser(props.user._id).then(() => {
      props.reload();
    });
  };

  const [user, setUser] = useState(props.user);

  useEffect(() => {}, []);
  return (
    <>
      <div className="flex-row slot2 flex-center flex-between p-4">
        <div flex-col p-3 ml-1>
          <p className="black-text userName">
            {"Nombre: " + props.user.name + " " + props.user.lastname}
          </p>
          <p className="black-text">
            {props.user.isAdmin ? "Administrador" : "Operador"}
          </p>
        </div>
        <div className="flex-col flex-center">
          <button
            className="button-blue"
            onClick={() => {
              props.setUserEdit(user);
              props.edit();
            }}
          >
            Editar
          </button>
          <button className="button-blue" onClick={deleteUser}>
            Eliminar
          </button>
        </div>
      </div>
    </>
  );
}

export default withRouter(User);
