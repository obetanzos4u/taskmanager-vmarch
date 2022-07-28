import React, { useEffect, useRef, useState } from "react";
import api from "../../utils/api";
import Message from "../general/message";

function CreateUser(props) {
  const user = useRef();
  const name = useRef();
  const lastname = useRef();
  const password = useRef();
  const password2 = useRef();
  const admin = useRef();
  const site = useRef();
  const sapNumber = useRef();

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

  const clear = () => {
    user.current.value = "";
    name.current.value = "";
    lastname.current.value = "";
    password.current.value = "";
    password2.current.value = "";
    site.current.value = "";
    admin.current.checked = false;
    sapNumber.current.value = "";
  };

  useEffect(() => {
   // console.log(props);
    if (props.title == "Editar usuario") {
      set();
    }
  }, []);

  const set = () => {
    user.current.value = props.users.user;
    name.current.value = props.users.name;
    lastname.current.value = props.users.lastname;
    admin.current.checked = props.users.isAdmin;
    site.current.value = props.users.site;
    sapNumber.current.value = props.users.sapNumber;
  };
  const save = () => {
    if (
      user.current.value == "" ||
      name.current.value == "" ||
      lastname.current.value == "" ||
      site.current.value == ""
    ) {
      sendMessage("error", "campos vacios");
    } else {
      if (props.title == "Crear usuario") {
        if (
          password.current.value != password2.current.value ||
          password.current.value == "" ||
          password2.current.value == ""
        ) {
          sendMessage(
            "error",
            "Las constraseñas no coinciden o los campos estan vacios"
          );
        } else {
          let obj = {
            user: user.current.value,
            name: name.current.value,
            lastname: lastname.current.value,
            password: password.current.value,
            isAdmin: admin.current.checked,
            site: site.current.value,
            sapNumber: sapNumber.current.value,
          };

          //API call right hurr
          api
            .createUser(obj)
            .then(() => {
              clear();
              props.users();
            })
            .catch((err) => {
              sendMessage("error", err);
            });
        }
      } else {
        if (password.current.value == "" || password2.current.value == "") {
          let obj = {
            user: user.current.value,
            name: name.current.value,
            lastname: lastname.current.value,

            isAdmin: admin.current.checked,
            site: site.current.value,
            sapNumber: sapNumber.current.value,
          };
          //API call right hurr
          api
            .updateUser({ id: props.users._id, info: obj })
            .then((response) => {
              console.log(response);
              clear();
              props.user();
            })
            .catch((err) => {
              sendMessage("error", err);
            });
        } else {
          if (password.current.value != password2.current.value) {
            sendMessage("error", "Las contraseñas no coinciden");
          } else {
            let obj = {
              id: props.users._id,
              user: user.current.value,
              name: name.current.value,
              lastname: lastname.current.value,
              password: password.current.value,
              isAdmin: admin.current.checked,
              site: site.current.value,
              sapNumber: sapNumber.current.value,
            };
            //API call right hurr
            api
              .updateUser(obj)
              .then((response) => {
                clear();
                props.user();
              })
              .catch((err) => {
                sendMessage("error", err);
              });
          }
        }
      }
    }
  };

  return (
    <>
      <div className="flex-col p-4">
        <h1 className="title">{props.title}</h1>
        <div className="flex-col">
          <label>Usuario</label>
          <input ref={user} type="text" />
          <label>Nombre</label>
          <input ref={name} type="text" />
          <label>Apellido</label>
          <input ref={lastname} type="text" />

          <label>Contraseña</label>
          <input ref={password2} type="password" />
          <label>Repetir contraseña</label>
          <input ref={password} type="password" />

          <label>Sede</label>
          <input ref={site} />

          <label>Numero Sap</label>
          <input ref={sapNumber} type="number" />
          <div className="flex-row p-1">
            <label>Administrador </label>
            <input type="checkbox" ref={admin} />
          </div>
        </div>
        <div className="flex-row flex-center p-4">
          <div className="button-withe" onClick={save}>
            Guardar
          </div>
        </div>
      </div>
      {message}
    </>
  );
}

export default CreateUser;
