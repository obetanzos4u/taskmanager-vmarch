import axios from "axios";

export default {
  getTask: function (params) {
    return axios.post("/getTask", params);
  },
  getTaskOut: function () {
    return axios.get("/getTaskOutbound");
  },
  getTaskInt: function () {
    return axios.get("/getTaskInternal");
  },
  postTask: function (info) {
    return axios.post("/postTask", info);
  },
  getLabels: function () {
    return axios.get("/getLabels");
  },
  getLabel: function (data) {
    return axios.post("/getLabel", { label: data });
  },
  getLabelProduct: function (info) {
    return axios.post("/getLabelProduct", { data: info });
  },
  postLote: function (info) {
    return axios.post("/postLote", { info });
  },
  getUpc: function (upc) {
    return axios.post("/getUpc", { upc });
  },
  getUUID: function (UUID) {
    return axios.post("/getUUID", { uuid: UUID });
  },
  login: function (user, pas) {
    return axios.post("/find", { user: user, password: pas });
  },
  getAll: function () {
    return axios.get("/getAll");
  },
  createUser: function (data) {
    return axios.post("/createUser", data);
  },
  deleteUser: function (data) {
    console.log(data);
    return axios.post("/deleteUser", { _id: data });
  },
  updateUser: function (data) {
    return axios.post("/updateUser", data);
  },
  getPartner: function (id) {
    return axios.post("/getPartner", { ide: id });
  },
  getItemText: function (ID) {
    return axios.post("/getItemText", { id: ID });
  },
  saveRecord: function (data) {
    return axios.post("/saveRecord", data);
  },
  getStock: function (data) {
    return axios.post("/getStock", {
      material: data.material,
      site: data.site,
    });
  },
  getUnits: function () {
    return axios.get("/getUnits");
  },
  getSeries: function (data) {
    return axios.post("/getSerialNumbers", { data });
  },
};
