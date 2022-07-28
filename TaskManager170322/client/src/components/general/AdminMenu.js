import React from "react";

function AdminMainMenu(props) {
  return (
    <>
      <div className="flex-col flex-between">
        <div className="flex-row flex-between p-3">
          <div>
            <i
              className="fas fa-door-closed fa-2x"
              onClick={() => props.logout()}
            />{" "}
          </div>
          <h1> Administrador </h1>
          <div>
            <i className="" />{" "}
          </div>
        </div>
        <div className="flex-row">
          <a
            className="menu-button"
            onClick={() => {
              props.users();
            }}
          >
            Usuarios
          </a>
          <a
            className="menu-button"
            onClick={() => {
              props.create();
            }}
          >
            Nuevo
          </a>
          <a
            onClick={() => {
              props.editCurrent();
            }}
            className="menu-button"
          >
            Datos
          </a>
          <a className="menu-button">Configuracion</a>
        </div>
      </div>
    </>
  );
}

export default AdminMainMenu;
