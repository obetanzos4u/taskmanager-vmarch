import React from "react";

function Modal(props) {
  return props.on ? (
    <div className="modal flex-col flex-center">{props.type}</div>
  ) : null;
}

export default Modal;
