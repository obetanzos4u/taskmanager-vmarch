import React, { useEffect, useState } from "react";
import AdminMenu from "../general/AdminMenu";
import User from "../general/user";
import CreateUser from "../general/createUser";
import { useStoreAllContext } from "../../utils/allTask";
import { withRouter } from "react-router-dom";
import SquareLoader from "react-spinners/ClipLoader";
import api from "../../utils/api";
import { get } from "request";

function AdminList(props) {
  const { user, setUser, isAdmin } = useStoreAllContext();
  let [loading, setLoading] = useState(true);
  let [color, setColor] = useState("#ffffff");
  let [content, setContent] = useState();
  let [userEdit, setUserEdit] = useState({});
  let [current, setCurrent] = useState();

  //"users", "create", "data"

  useEffect(() => {
    if (!isAdmin) {
      props.history.push("/main");
    } else {
      getUsers();
    }
  }, []);

  const logout = () => {
    setUser("");
    props.history.push("/");
  };

  const getUsers = () => {
    api.getAll().then((response) => {
      let userList = response.data.filter((value) => {
        return value._id != user;
      });

      let curr = response.data.filter((value) => {
        return value._id == user;
      });

      setCurrent(curr[0]);

      let render = userList.map((element) => {
        let userItem = (
          <User
            reload={getUsers}
            edit={() => {
              editUser();
            }}
            user={element}
            setUserEdit={setUserEdit}
          />
        );
        return userItem;
      });
      setContent(render);

      setLoading(false);
    });
  };

  const createScreen = () => {
    setLoading(false);
    setContent(<CreateUser title={"Crear usuario"} users={getUsers} />);
  };

  const editUser = () => {
    setContent(
      <CreateUser title={"Editar usuario"} users={userEdit} user={getUsers} />
    );
  };

  const editCurrent = () => {
    setContent(
      <CreateUser title={"Editar usuario"} users={current} user={getUsers} />
    );
  };

  return (
    <>
      <div className="flex-col flex-between">
        <AdminMenu
          logout={logout}
          create={createScreen}
          users={getUsers}
          editCurrent={editCurrent}
        />
        <div className="flex-col flex-center p-1">
          <SquareLoader color={color} loading={loading} size={150} />
        </div>
        {content}
      </div>
    </>
  );
}

export default withRouter(AdminList);
