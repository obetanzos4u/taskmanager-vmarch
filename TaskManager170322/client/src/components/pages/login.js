import React, { useEffect, useRef, useState } from "react";
import SquareLoader from "react-spinners/ClipLoader";
import { withRouter } from "react-router-dom";
import Singup from "../pages/signUp";
import api from "../../utils/api";
import { useStoreAllContext } from "../../utils/allTask";
import Message from "../general/message";

function Login(props) {
  let [loading, setLoading] = useState(false);
  let [color, setColor] = useState("#ffffff");
  const [modal, setModal] = useState();
  const userf = useRef();
  const admin = useRef();
  const password = useRef();

  const {
    user,
    setUser,
    setAdmin,
    setSite,
    setEmployee,
  } = useStoreAllContext();

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

  const login = () => {
    if (!admin.current.checked) {
      if (userf.current.value != "" && password.current.value) {
        api
          .login(userf.current.value, password.current.value)
          .then((response) => {
            if (response.data.length > 0) {
              setUser(response.data[0]._id);
              setSite(response.data[0].site);
              setEmployee(response.data[0].sapNumber);

              props.history.push("/main");
            } else {
              sendMessage("warning", "usuario no valido");
            }
          });
      } else {
        sendMessage("warning", "Campos vacios");
      }
    } else {
      if (userf.current.value != "" && password.current.value) {
        api
          .login(userf.current.value, password.current.value)
          .then((response) => {
            if (response.data.length > 0) {
              setUser(response.data[0]._id);
              setSite(response.data[0].site);
              setEmployee(response.data[0].sapNumber);

              if (response.data[0].isAdmin) {
                setAdmin(true);
                props.history.push("/Admin");
              } else {
                props.history.push("/Main");
              }
            } else {
              sendMessage("warning", "usuario no valido");
            }
          });
      } else {
        sendMessage("warning", "Campos Vacios");
      }
    }
  };

  const closeModal = () => {
    setModal();
  };

  const signup = () => {
    setModal(<Singup history={props.history} cancel={closeModal} />);
  };
  return (
    <>
      <div className="flex-col flex-center fhv">
        <SquareLoader color={color} loading={loading} size={150} />
        <div className="flex-col">
          <div className="flex-col">
            <label>User</label>
            <input ref={userf} type="text" />
            <label>Password</label>
            <input ref={password} type="password" />
          </div>
          <div className="flex-row p-1">
            <label>Administrador </label>
            <input type="checkbox" ref={admin} />
          </div>
          <div className="flex-row flex-center">
            <div className="button-white" onClick={login}>
              Entrar
            </div>
          </div>
        </div>
        {modal}
      </div>
      {message}
    </>
  );
}

export default withRouter(Login);
