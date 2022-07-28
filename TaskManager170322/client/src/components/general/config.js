import React, { useEffect, useState } from "react";
import { withRouter } from "react-router-dom";
import api from "../../utils/api";

function Config() {
  useEffect(() => {}, []);
  return (
    <>
      <div className="flex-col slot2 flex-center flex-between p-4">
        <div className="section flex-row">
          <p className="label">System URL</p>
          <input className="input" />
        </div>
        <div className="section flex-col">
          <div className="flex-row">
            <p className="label">Usuario funcional</p>
            <input className="input" />
          </div>
          <div className="flex-row">
            <p className="label">Contraseña</p>
            <input className="input" type="password" />
          </div>
        </div>
        <div className="section flex-rows">
          <div className="flex-row">
            <p className="label">Usuario tecnico</p>
            <input className="input" />
          </div>
          <div className="flex-row">
            <p className="label">Contraseña</p>
            <input className="input" type="password" />
          </div>
        </div>
        <div className="section flex-rows"></div>
      </div>
    </>
  );
}

export default withRouter(Config);
