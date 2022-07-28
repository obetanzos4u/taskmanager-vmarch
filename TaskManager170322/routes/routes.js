const { default: axios } = require("axios");
var request = require("request");
var soap = require("strong-soap").soap;
var access = {
  system: "https://my338095.sapbydesign.com/",
  odata: { user: "hsandoval", password: "Sistemas2021" },
  soap: { user: "_TASK2", password: "Almacen$nube21%." },
};
module.exports = function (app) {
  app.get("/getUnits", (req, res) => {
    console.log(
      "-------------------------------------------------------------------------------------------------------------------------------------------"
    );
    ("use strict");

    var soap = require("strong-soap").soap;

    //var uname = access.soap.user
    //var pword = access.soap.password;
    var uname = access.soap.user;
    var pword = access.soap.password;

    var url = "./wsdl/QueryCodelistIn.wsdl";

    var options = {};

    var requestArgs = {
      CodeListByIDQuery_sync: {
        CodeListSelectionByID: {
          SelectionByCodeDataType: {
            Name: "MeasureUnitCode",
            NamespaceURI: "http://sap.com/xi/AP/Common/GDT",
          },
          SelectionByLanguageCode: "ES",
        },
      },
    };

    soap.createClient(url, options, function (err, client) {
      var method = client["FindCodeListByID"];
      client.setSecurity(new soap.BasicAuthSecurity(uname, pword));

      method(requestArgs, function (err, result, envelope, soapHeader) {
        console.log("Response Envelope: \n" + envelope);
        //'result' is the response body
        console.log("Result: \n" + JSON.stringify(result));

        res.send(JSON.stringify(result));
      });
    });
  });

  app.post("/getTask", (req, res) => {
    "use strict";

    var soap = require("strong-soap").soap;

    //var uname = access.soap.user
    //var pword = access.soap.password;
    var uname = access.soap.user;
    var pword = access.soap.password;

    var url = "./wsdl/QuerySiteLogisticsTaskIn.wsdl";

    var options = {};

    var requestArgs = {
      SiteLogisticsTaskByElementsQuery_sync: {
        SiteLogisticsTaskSelectionByElements: {
          SelectionByProcessTypeCode: {
            InclusionExclusionCode: "I",
            IntervalBoundaryTypeCode: "1",
            LowerBoundaryProcessTypeCode: req.body.type,
          },
          SelectionBySiteID: {
            InclusionExclusionCode: "I",
            IntervalBoundaryTypeCode: "1",
            LowerBoundarySiteID: req.body.site,
          },
        },
        ProcessingConditions: {
          //QueryHitsMaximumNumberValue: 10,
          QueryHitsUnlimitedIndicator: true,
        },
      },
    };

    soap.createClient(url, options, function (err, client) {
      var method = client["FindByElements"];
      client.setSecurity(new soap.BasicAuthSecurity(uname, pword));

      method(requestArgs, function (err, result, envelope, soapHeader) {
        //response envelope

        //console.dir(result);

        res.send(JSON.stringify(result));
      });
    });
  });

  app.post("/postLote", (req, res) => {
    var uname = access.soap.user;
    var pword = access.soap.password;

    const { id, description, externalId, product } = req.body.info;

    var url = "./wsdl/ManageIdentifiedStocksIn.wsdl";

    var options = {};

    var requestArgs = {
      IdentifiedStockMaintainRequestMessage: {
        BasicMessageHeader: {},

        IdentifiedStockMaintainBundle: {
          $attributes: {
            actionCode: "01",
            activateIdentifiedStockIndicator: "true",
          },

          IdentifiedStockID: id,
          ExternalIdentifiedStockID: externalId,
          ProductID: product,
          /* Description: {
          $attributes: { actionCode: "01" },
          Description: {
            $attributes: { languageCode: "ES" },
            $value: description,
          },
        },*/
        },
      },
    };

    soap.createClient(url, options, function (err, client) {
      var method = client["MaintainBundle"];
      client.setSecurity(new soap.BasicAuthSecurity(uname, pword));

      method(requestArgs, function (err, result, envelope, soapHeader) {
        //response envelope

        //console.dir(result);

        res.send(JSON.stringify(result));
      });
    });
  });

  app.get("/getLabels", (req, res) => {
    var url =
      access.system +
      "sap/byd/odata/cust/v1/labels/GoodsTagCollection?&$expand=MaterialMaterial";

    request.get(
      url,
      {
        auth: {
          // user: "jpineda",
          //pass: "Pruebas10*",
          user: access.odata.user,
          pass: access.odata.password,
          sendImmediately: false,
        },
        json: true,
      },
      function (error, response, body) {
        res.send(body.d.results);
      }
    );
  });

  app.post("/getLabel", (req, res) => {
    var url =
      access.system +
      "sap/byd/odata/cust/v1/labels/GoodsTagCollection?$filter=ID eq '" +
      req.body.label +
      "'&$expand=MaterialMaterial";

    request.get(
      url,
      {
        auth: {
          // user: "jpineda",
          //pass: "Pruebas10*",
          user: access.odata.user,
          pass: access.odata.password,
          sendImmediately: false,
        },
        json: true,
      },
      function (error, response, body) {
        res.send(body.d.results);
      }
    );
  });

  app.post("/getLabelProduct", (req, res) => {
    console.log("-------------------------------");
    console.log(req.body);
    request.get(
      req.body.data,
      {
        auth: {
          user: access.odata.user,
          pass: access.odata.password,
          sendImmediately: false,
        },
        json: true,
      },
      function (error, response, body) {
        console.log("-------------------------------");
        console.log(body.d.results);
        res.send(body.d.results);
      }
    );
  });

  app.post("/postTask", (req, res) => {
    var uname = access.soap.user;
    var pword = access.soap.password;

    var url = "./wsdl/ManageSiteLogisticsTaskIn.wsdl";

    var options = {};

    console.log("----------------------------------------");
    console.log(
      req.body.requestArgs.SiteLogisticsTaskBundleMaintainRequest_sync_V1
        .SiteLogisticsTask.ReferenceObject
    );

    soap.createClient(url, options, function (err, client) {
      var method = client["MaintainBundle_V1"];
      client.setSecurity(new soap.BasicAuthSecurity(uname, pword));

      method(
        req.body.requestArgs,
        function (err, result, envelope, soapHeader) {
          //response envelope
          console.log("Response Envelope: \n" + envelope);
          //'result' is the response body
          console.log("Result: \n" + JSON.stringify(result));

          console.dir(result.body);

          res.send(JSON.stringify(result.body));
        }
      );
    });
  });

  app.post("/getUpc", (req, res) => {
    var url =
      access.system +
      "sap/byd/odata/cust/v1/materials/MaterialGlobalTradeItemNumberCollection?$filter=ID eq '" +
      req.body.upc +
      //"'&$expand=Material&$expand=MaterialQuantityConversionCollection_MaterialCollection";
      "'&$expand=Material";

    request.get(
      url,
      {
        auth: {
          user: access.odata.user,
          pass: access.odata.password,
          sendImmediately: false,
        },
        json: true,
      },
      function (error, response, body) {
        res.send(body.d.results);
      }
    );
  });

  app.post("/getUUID", (req, res) => {
    var url =
      access.system +
      "sap/byd/odata/cust/v1/materials/MaterialCollection?$filter=InternalID eq '" +
      req.body.uuid +
      "'";

    request.get(
      url,
      {
        auth: {
          user: access.odata.user,
          pass: access.odata.password,
          sendImmediately: false,
        },
        json: true,
      },
      function (error, response, body) {
        res.send(body.d.results);
      }
    );
  });

  app.post("/getPartner", (req, res) => {
    var url =
      //https://my357755.sapbydesign.com/sap/byd/odata/cust/v1/purchase/PurchaseOrderCollection?$filter=ID eq '1500000319'&$expand=AddressSnapshotAddressSnapshot/AddressSnapshotFormattedAddress

      access.system +
      "sap/byd/odata/cust/v1/purchase/PurchaseOrderCollection?$filter=ID eq '" +
      req.body.ide +
      "'&$expand=AddressSnapshotAddressSnapshot/AddressSnapshotFormattedAddress";

    request.get(
      url,
      {
        auth: {
          user: access.odata.user,
          pass: access.odata.password,
          sendImmediately: false,
        },
        json: true,
      },
      function (error, response, body) {
        res.send(body.d.results);
      }
    );
  });

  app.post("/getItemText", (req, res) => {
    var url =
      //https://my357755.sapbydesign.com/sap/byd/odata/cust/v1/purchase/PurchaseOrderCollection?$filter=ID eq '1500000319'&$expand=AddressSnapshotAddressSnapshot/AddressSnapshotFormattedAddress

      access.system +
      "sap/byd/odata/cust/v1/materials/MaterialCollection?$filter=InternalID eq '" +
      req.body.id +
      "'";

    request.get(
      url,
      {
        auth: {
          user: access.odata.user,
          pass: access.odata.password,
          sendImmediately: false,
        },
        json: true,
      },
      function (error, response, body) {
        res.send(body.d.results);
      }
    );
  });

  app.post("/getSerialNumbers", (req, res) => {
    console.log(req.body);
    var url =
      //https://my357755.sapbydesign.com/sap/byd/odata/cust/v1/series/SerialInventoryItemCollection?$filter=ProductInternalID eq'ICOITM40'&$filter=ID eq'AB1C1'

      access.system +
      "sap/byd/odata/cust/v1/series/SerialInventoryItemCollection?$filter=ProductInternalID eq'" +
      req.body.data.id +
      "'and site eq '" +
      req.body.data.site +
      "'";

    request.get(
      url,
      {
        auth: {
          user: access.odata.user,
          pass: access.odata.password,
          sendImmediately: false,
        },
        json: true,
      },
      function (error, response, body) {
        res.send(body.d.results);
      }
    );
  });

  app.post("/getStock", (req, res) => {
    console.log(req.body);
    var url =
      access.system +
      "sap/byd/odata//scm_internallogistics_analytics.svc/RPSCMINVV02_Q0001QueryResults?$select=TLOG_AREA_UUID,TIML_UUID,C1ISTOCK_UUIDsISTOCK_ID,CSITE_UUID,TSITE_UUID,TON_HAND_STOCK_UOM,CLOG_AREA_UUID,CISTOCK_UUID,CINV_TYPE,TISTOCK_UUID,KCON_HAND_STOCK&$filter=(CMATERIAL_UUID eq '" +
      req.body.material +
      "      ') and (CSITE_UUID eq '" +
      req.body.site +
      "') and (CINV_TYPE eq '2')&$top=10000&$format=json";

    request.get(
      url,
      {
        auth: {
          user: access.odata.user,
          pass: access.odata.password,
          sendImmediately: false,
        },
        json: true,
      },
      function (error, response, body) {
        res.send(body.d.results);
      }
    );
  });
};
