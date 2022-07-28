import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Item from "../general/item";
import MainMenu from "../general/mainMenu";
import { useStoreContext } from "../../utils/taskState";
import Message from "../general/message";
import { useStoreSlotContext } from "../../utils/slotState";
import api from "../../utils/api";
import { withRouter } from "react-router-dom";
import { useStoreAllContext } from "../../utils/allTask";
import SquareLoader from "react-spinners/ClipLoader";

function ManageTask(props) {
  var count = -1;

  const { currentSlot } = useStoreSlotContext();
  const { globalItems, setGlobalItems } = useStoreContext();
  const {
    setAllTask,
    currentBlock,
    setLabels,
    sapLabels,
    operation,
    setOperation,
    user,
    sapNumber,
  } = useStoreAllContext();

  const [state, setState] = useState(currentSlot);

  let [loading, setLoading] = useState(false);
  let [color, setColor] = useState("#ffffff");

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

  const getRemaining = () => {
    //get only open quantity
    let remaining = [];

    if (operation == "internal") {
      for (
        let n = 0;
        n <
        state.SiteLogisticsTaskReferencedObject
          .SiteLogisticsLotOperationActivity.MaterialOutput.length;
        n++
      ) {
        if (
          state.SiteLogisticsTaskReferencedObject
            .SiteLogisticsLotOperationActivity.MaterialOutput[n].OpenQuantity
            .$value > 0 &&
          state.SiteLogisticsTaskReferencedObject
            .SiteLogisticsLotOperationActivity.MaterialOutput.length ==
            state.SiteLogisticsTaskReferencedObject
              .SiteLogisticsLotOperationActivity.MaterialInput.length
        ) {
          remaining.push([
            state.SiteLogisticsTaskReferencedObject
              .SiteLogisticsLotOperationActivity.MaterialInput[n],
            state.SiteLogisticsTaskReferencedObject
              .SiteLogisticsLotOperationActivity.MaterialOutput[n],
          ]);
        } else {
          if (
            state.SiteLogisticsTaskReferencedObject
              .SiteLogisticsLotOperationActivity.MaterialOutput[n].OpenQuantity
              .$value > 0 &&
            state.SiteLogisticsTaskReferencedObject
              .SiteLogisticsLotOperationActivity.MaterialInput.length == 1
          ) {
            remaining.push([
              state.SiteLogisticsTaskReferencedObject
                .SiteLogisticsLotOperationActivity.MaterialInput[0],
              state.SiteLogisticsTaskReferencedObject
                .SiteLogisticsLotOperationActivity.MaterialOutput[n],
            ]);
          }
        }
      }
      return remaining;
    } else {
      for (
        let n = 0;
        n <
        state.SiteLogisticsTaskReferencedObject
          .SiteLogisticsLotOperationActivity.MaterialInput.length;
        n++
      ) {
        if (
          state.SiteLogisticsTaskReferencedObject
            .SiteLogisticsLotOperationActivity.MaterialInput[n].OpenQuantity
            .$value > 0
        ) {
          remaining.push([
            state.SiteLogisticsTaskReferencedObject
              .SiteLogisticsLotOperationActivity.MaterialInput[n],
            state.SiteLogisticsTaskReferencedObject
              .SiteLogisticsLotOperationActivity.MaterialOutput[n],
          ]);
        }
      }
      return remaining;
    }
  };

  const saveTask = () => {
    setGlobalItems(globalItems);
    if (globalItems.length > 0) {
      setLoading(true);

      let itemsList = [];
      let itemsListIn = [];
      if (operation == "internal") {
        /////////////////////////////////////////////////////////////
        // FOR INTERNAL TASK
        /////////////////////////////////////////////////////////////
        // console.log(globalItems);
        globalItems.forEach((element) => {
          if (element.series.length > 1) {
            for (var i = 0; i < element.series.length; i++) {
              if (i == 0) {
                let MaterialOutput = {
                  MaterialOutputUUID: element.idOut,
                  ProductID: element.product,
                  ActualQuantity: {
                    $attributes: { unitCode: element.unit },
                    $value: 1,
                  },
                  IdentifiedStockID: element.series[i].lot,
                  //IdentifiedStockID: "",

                  SplitIndicator: element.split,
                  SerialNumber: { SerialID: element.series[i].serie },
                };
                itemsList.push({ MaterialOutput: MaterialOutput });
              } else if (i != element.series.length - 1) {
                let MaterialOutput = {
                  ProductID: element.product,
                  ActualQuantity: {
                    $attributes: { unitCode: element.unit },
                    $value: 1,
                  },
                  IdentifiedStockID: element.series[i].lot,
                  //IdentifiedStockID: "",

                  SplitIndicator: element.split,
                  SerialNumber: { SerialID: element.series[i].serie },
                };
                itemsList.push({ MaterialOutput: MaterialOutput });
              } else {
                let MaterialOutput = {
                  ProductID: element.product,
                  ActualQuantity: {
                    $attributes: { unitCode: element.unit },
                    $value: 1,
                  },
                  IdentifiedStockID: element.series[i].lot,
                  //IdentifiedStockID: "",

                  SerialNumber: { SerialID: element.series[i].serie },
                };
                itemsList.push({ MaterialOutput: MaterialOutput });
              }
            }
          } else {
            if (element.series.length == 1) {
              let MaterialOutput = {
                MaterialOutputUUID: element.idOut,
                ProductID: element.product,
                ActualQuantity: {
                  $attributes: { unitCode: element.unit },
                  $value: element.quantity,
                },
                IdentifiedStockID: element.series[0].lot,
                //IdentifiedStockID: "",

                SplitIndicator: element.split,
                SerialNumber: { SerialID: element.series[0].serie },
              };
              itemsList.push({ MaterialOutput: MaterialOutput });
            } else {
              let MaterialInput = {
                MaterialInputUUID: element.id,
                ProductID: element.product,
                /*ActualQuantity: {
                  $attributes: { unitCode: element.unit },
                  $value: element.quantity,
                },

                //IdentifiedStockID: "",*/
                SourceLogisticsAreaID: element.location,
                /*IdentifiedStockID: element.lote,
                //TargetLogisticsAreaID: element.location,*/
                // SplitIndicator: element.split,
              };
              itemsListIn.push({ MaterialInput: MaterialInput });
              let MaterialOutput = {
                MaterialOutputUUID: element.idOut,
                ProductID: element.product,
                ActualQuantity: {
                  $attributes: { unitCode: element.unit },
                  $value: element.quantity,
                },

                //IdentifiedStockID: "",
                SourceLogisticsAreaID: element.location,
                IdentifiedStockID: element.lote,
                //TargetLogisticsAreaID: element.location,
                SplitIndicator: element.split,
              };
              itemsList.push({ MaterialOutput: MaterialOutput });
            }
          }
        });
      } else if (operation == "outbound") {
        /////////////////////////////////////////////////////////////
        // FOR OUTBOUND TASK
        /////////////////////////////////////////////////////////////
        console.log(globalItems);
        globalItems.forEach((element) => {
          if (element.series.length > 1) {
            for (var i = 0; i < element.series.length; i++) {
              //for the first
              if (i == 0) {
                let MaterialOutput = {
                  MaterialOutputUUID: element.id,
                  ProductID: element.product,
                  ActualQuantity: {
                    $attributes: { unitCode: element.unit },
                    $value: 1,
                  },
                  IdentifiedStockID: element.series[i].lot,
                  //IdentifiedStockID: "",
                  SourceLogisticsAreaID: element.series[i].location,
                  SplitIndicator: true,
                  SerialNumber: { SerialID: element.series[i].serie },
                };
                itemsList.push({ MaterialOutput: MaterialOutput });
                let MaterialInput = {
                  MaterialInputUUID: element.idIn,
                  ProductID: element.product,
                  SourceLogisticsAreaID: element.series[i].location,
                };
                itemsListIn.push({ MaterialInput: MaterialInput });
              } else if (i != element.series.length - 1) {
                //for the middle
                let MaterialOutput = {
                  ProductID: element.product,
                  ActualQuantity: {
                    $attributes: { unitCode: element.unit },
                    $value: 1,
                  },
                  IdentifiedStockID: element.series[i].lot,
                  //IdentifiedStockID: "",

                  SourceLogisticsAreaID: element.series[i].location,
                  SplitIndicator: true,
                  SerialNumber: { SerialID: element.series[i].serie },
                };
                itemsList.push({ MaterialOutput: MaterialOutput });
              } else {
                //for the last
                let MaterialOutput = {
                  ProductID: element.product,
                  ActualQuantity: {
                    $attributes: { unitCode: element.unit },
                    $value: 1,
                  },
                  IdentifiedStockID: element.series[i].lot,
                  //IdentifiedStockID: "",
                  SourceLogisticsAreaID: element.series[i].location,

                  SerialNumber: { SerialID: element.series[i].serie },
                };
                itemsList.push({ MaterialOutput: MaterialOutput });
              }
            }
          } else {
            if (element.series.length == 1) {
              let MaterialInput = {
                MaterialInputUUID: element.id,
                ProductID: element.product,
                SourceLogisticsAreaID: element.series[0].location,
              };
              itemsListIn.push({ MaterialInput: MaterialInput });
              let MaterialOutput = {
                MaterialOutputUUID: element.idOut,
                ProductID: element.product,
                ActualQuantity: {
                  $attributes: { unitCode: element.unit },
                  $value: element.quantity,
                },
                IdentifiedStockID: element.series[0].lot,
                //IdentifiedStockID: "",
                SourceLogisticsAreaID: element.series[0].location,
                SplitIndicator: element.split,
                SerialNumber: { SerialID: element.series[0].serie },
              };
              itemsList.push({ MaterialOutput: MaterialOutput });
            } else {
              let MaterialOutput = {
                MaterialOutputUUID: element.id,
                ProductID: element.product,
                ActualQuantity: {
                  $attributes: { unitCode: element.unit },
                  $value: element.quantity,
                },

                //IdentifiedStockID: "",
                SourceLogisticsAreaID: element.location,
                IdentifiedStockID: element.lote,
                //TargetLogisticsAreaID: element.location,
                SplitIndicator: element.split,
              };
              itemsList.push({ MaterialOutput: MaterialOutput });

              let MaterialInput = {
                MaterialInputUUID: element.idIn,
                ProductID: element.product,
                /*ActualQuantity: {
                  $attributes: { unitCode: element.unit },
                  $value: element.quantity,
                },

                //IdentifiedStockID: "",*/
                SourceLogisticsAreaID: element.location,
                /*IdentifiedStockID: element.lote,
                //TargetLogisticsAreaID: element.location,*/
                // SplitIndicator: element.split,
              };
              itemsListIn.push({ MaterialInput: MaterialInput });
            }
          }
        });
      } else {
        /////////////////////////////////////////////////////////////
        // FOR INBOUND TASK
        /////////////////////////////////////////////////////////////

        globalItems.forEach((element) => {
          /////////////////////////////////////////////////////////////
          // FOR MORE THAN 1 SERIAL NUMBER
          /////////////////////////////////////////////////////////////
          //split must be applied
          if (element.series.length > 1) {
            for (var i = 0; i < element.series.length; i++) {
              if (i == 0) {
                let MaterialOutput = {
                  MaterialOutputUUID: element.id,
                  ProductID: element.product,
                  ActualQuantity: {
                    $attributes: { unitCode: 1 },
                    $value: 1,
                  },
                  IdentifiedStockID: element.lote,

                  TargetLogisticsAreaID: element.location,
                  SerialNumber: { SerialID: element.series[i] },

                  SplitIndicator: true,
                };
                itemsList.push({ MaterialOutput: MaterialOutput });
                // console.log(itemsList);
              } else if (i != element.series.length - 1) {
                let MaterialOutput = {
                  ProductID: element.product,
                  ActualQuantity: {
                    $attributes: { unitCode: 1 },
                    $value: 1,
                  },
                  IdentifiedStockID: element.lote,

                  TargetLogisticsAreaID: element.location,
                  SerialNumber: { SerialID: element.series[i] },

                  SplitIndicator: true,
                };
                itemsList.push({ MaterialOutput: MaterialOutput });
              } else {
                let MaterialOutput = {
                  ProductID: element.product,
                  ActualQuantity: {
                    $attributes: { unitCode: 1 },
                    $value: 1,
                  },
                  IdentifiedStockID: element.lote,

                  TargetLogisticsAreaID: element.location,
                  SerialNumber: { SerialID: element.series[i] },
                  SplitIndicator: element.split,
                };
                itemsList.push({ MaterialOutput: MaterialOutput });
              }
            }
          } else {
            /////////////////////////////////////////////////////////////
            // FOR 1 SERIAL NUMBER OR NO SERIAL NUMBERS
            /////////////////////////////////////////////////////////////
            if (element.series.length == 1) {
              let MaterialOutput = {
                MaterialOutputUUID: element.id,
                ProductID: element.product,
                ActualQuantity: {
                  $attributes: { unitCode: 1 },
                  $value: element.quantity,
                },
                IdentifiedStockID: element.lote,
                //IdentifiedStockID: "",
                TargetLogisticsAreaID: element.location,
                SplitIndicator: element.split,
                SerialNumber: { SerialID: element.series[0] },
              };
              itemsList.push({ MaterialOutput: MaterialOutput });
            } else {
              let MaterialOutput = {
                MaterialOutputUUID: element.id,
                ProductID: element.product,
                ActualQuantity: {
                  $attributes: { unitCode: element.unit },
                  $value: element.quantity,
                },
                IdentifiedStockID: element.lote.id,
                //IdentifiedStockID: "",
                TargetLogisticsAreaID: element.location,
                SplitIndicator: element.split,
              };
              itemsList.push({ MaterialOutput: MaterialOutput });
              // if (element.split) {
              //   let MaterialOutputSplit = {
              //     ProductID: element.product,
              //   };
              //   itemsList.push({ MaterialOutput: MaterialOutputSplit });
              // }
            }
          }
        });
      }

      var requestArgs = {
        SiteLogisticsTaskBundleMaintainRequest_sync_V1: {
          BasicMessageHeader: {},
          SiteLogisticsTask: {
            SiteLogisticTaskID: state.SiteLogisticsTaskID,
            ReferenceObject: {
              OperationActivity: [itemsListIn, itemsList],
              //OperationActivity: [itemsListIn[0], itemsList[0]],
            },
          },
        },
      };

      // console.log(requestArgs);

      api
        .postTask({ requestArgs: requestArgs })
        .then((response) => {
          // console.log(response);
          if (response.data == "") {
            //save record
            let taskIds = globalItems.map((element) => {
              api
                .saveRecord({
                  user: user,
                  sapNumber: sapNumber,
                  task: element.id,
                })
                .then(() => {})
                .catch((err) => {
                  sendMessage("error", err);
                });

              return element.id;
            });

            setGlobalItems([]);
            //all task should be reloaded in case of partial confirmation
            setAllTask([]);
            props.history.push("/main");
          } else {
            setLoading(false);
            let test = response.data.match(
              new RegExp("<text>" + "(.*)" + "</text>")
            );
            let msg = test[0].replace("<text>", "");
            msg = msg.split("<")[0];

            //console.log(response);
            setLoading(false);
            sendMessage("warning", msg);
          }
        })
        .catch((error) => {
          sendMessage("error", "Error");
        });
    } else {
      sendMessage("warning", "No se ha realizado ninguna tarea");
    }
  };

  useEffect(() => {
    //  console.log(Item);
    if (!state.SiteLogisticsTaskReferencedObject) {
      props.history.push("/main");
    }
  }, []);

  return (
    <div className="flex-col fwv flex-center">
      <div className="flex-row flex-between slot fwv flex-center">
        <div className=" flex-col fw ml-1">
          <div className="flex-row h50 fw">
            <p className="black-text p-1 ">
              {"Tarea: " + state.SiteLogisticsTaskID}
            </p>
            <p className="black-text p-1 ">
              {"Referencia: " + state.BusinessTransactionDocumentReferenceID}
            </p>
            <p className="black-text p-1">
              {"Items: " +
                state.SiteLogisticsTaskReferencedObject
                  .SiteLogisticsLotOperationActivity.MaterialOutput.length}
            </p>
          </div>

          <div className="flex-row h50 fw">
            <p className="black-text p-1 client-text ">
              {operation != "internal"
                ? "Socio Comercial: " + state.CustomerParty.CustomerPartyName
                : ""}
            </p>
          </div>
        </div>
        <div className="flex-col flex-center">
          <div className="button2 black  flex-col flex-center">
            <Link
              to="/main"
              className="black-text fas fa-window-close fa-2x"
            ></Link>
          </div>
          <a onClick={saveTask} className="button2 blue flex-col flex-center">
            <i class=" fas fa-cloud-upload-alt fa-2x"></i>
          </a>
        </div>{" "}
      </div>
      {loading ? (
        <div className="flex-center fullv">
          <SquareLoader color={color} loading={loading} size={150} />
        </div>
      ) : null}
      <div id="items" className="flex-col">
        {getRemaining().map((item) => {
          return <Item data={item[0]} out={item[item.length - 1]} />;
        })}
      </div>
      {message}
    </div>
  );
}

export default withRouter(ManageTask);
