import React, { useEffect, useState } from "react";
import MainMenu from "../general/mainMenu";
import Slot from "../general/slot";
import API from "../../utils/api";
import { useStoreAllContext } from "../../utils/allTask";
import { withRouter } from "react-router-dom";
import SquareLoader from "react-spinners/ClipLoader";
import { useStoreContext } from "../../utils/taskState";
import api from "../../utils/api";

function List(props) {
  const {
    setAllTask,
    currentBlock,
    setLabels,
    sapLabels,
    operation,
    setOperation,
    user,
    setUser,
    units,
    setUnits,
    site,
  } = useStoreAllContext();
  const { globalItems, setGlobalItems } = useStoreContext();
  const [task, setTask] = useState([]);
  let [loading, setLoading] = useState(true);
  let [color, setColor] = useState("#ffffff");

  useEffect(() => {
    if (user == "") {
      props.history.push("/");
    } else {
      if (units.length == 0) {
        api.getUnits().then((unitList) => {
         // console.log(unitList);
          setUnits(unitList.data.CodeList[0].Code);
        });
      } else {
      }
     // console.log(currentBlock);
      if (currentBlock.length == 0) {
        reload();
      } else {
        setTask(currentBlock);
        setLoading(false);
      }
      setGlobalItems([]);
    }
  }, []);

  const setInbound = () => {
    setTask([]);
    setLoading(true);

    API.getTask({ site: site, type: "1" }).then((data) => {
      if (data.data.SiteLogisticsTask) {
        if (data.data.SiteLogisticsTask.length == 0) {
        } else {
          data.data.SiteLogisticsTask.forEach((element) => {
            api
              .getPartner(element.BusinessTransactionDocumentReferenceID)
              .then((response) => {
                element.CustomerParty.CustomerPartyName =
                  response.data[0].AddressSnapshotAddressSnapshot.AddressSnapshotFormattedAddress[0].FormattedName;
                setAllTask(data.data.SiteLogisticsTask);
                setTask(data.data.SiteLogisticsTask);
              });
          });

          setOperation("inbound");
          setLoading(false);
        }
      }
    });
  };

  const setOutbound = () => {
    setTask([]);
    setLoading(true);

    API.getTask({ site: site, type: "2" }).then((response) => {
      setAllTask(response.data.SiteLogisticsTask);
      setTask(response.data.SiteLogisticsTask);
      setOperation("outbound");
      setLoading(false);
     // console.log(response.data.SiteLogisticsTask);
    });
  };

  const setInternal = () => {
    setTask([]);
    setLoading(true);
    API.getTask({ site: site, type: "3" }).then((response) => {
      setAllTask(response.data.SiteLogisticsTask);
      setTask(response.data.SiteLogisticsTask);
      setOperation("internal");
      setLoading(false);
    });
  };

  const reload = () => {
    setAllTask([]);
    setTask([]);
    if (operation == "" || operation == "inbound") {
      setInbound();
    } else if (operation == "internal") {
      setInternal();
    } else {
      setOutbound();
    }
  };

  const logout = () => {
    setUser("");
    setAllTask([]);
    setTask([]);
    props.history.push("/");
  };

  return (
    <>
      <div className="flex-col flex-between">
        <MainMenu
          out={setOutbound}
          in={setInbound}
          int={setInternal}
          reload={reload}
          task={task}
          setTask={setTask}
          logout={logout}
        />
        <div className="flex-col flex-center p-1">
          <SquareLoader color={color} loading={loading} size={150} />
          {task.length > 0
            ? task.map((slot) => {
                return (
                  <Slot
                    history={props.history}
                    ide={slot.SiteLogisticsTaskID}
                    reference={slot.BusinessTransactionDocumentReferenceID}
                    socio={
                      slot.CustomerParty
                        ? slot.CustomerParty.CustomerPartyName
                        : null
                    }
                    data={slot}
                    items={
                      slot.SiteLogisticsTaskReferencedObject
                        .SiteLogisticsLotOperationActivity.MaterialOutput
                    }
                    itemsFull={
                      slot.SiteLogisticsTaskReferencedObject
                        .SiteLogisticsLotOperationActivity
                    }
                  />
                );
              })
            : null}
        </div>
      </div>
    </>
  );
}

export default withRouter(List);
