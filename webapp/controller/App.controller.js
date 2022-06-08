sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/Fragment",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    'sap/m/MessageToast',
    "../model/formatter",
    "sap/m/MessageBox"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, Fragment, Filter, FilterOperator, MessageToast, formatter,MessageBox) {
        "use strict";

        return Controller.extend("Task2.task2.controller.App", {
            formatter: formatter,
            onInit: function () {

                var oModel = this.getView().getModel();
                var that = this;

                this.getView().byId("Table").setVisible(false);

                this.Counter = 1;

                var obj = [{
                    index: 1,
                    Matnr: null,
                    Maktx: null,
                    Ernam: null,
                    Laeda: null,
                    Status: null,
                }];

                this.allItems = obj;
                var that = this;

                var sRequest = new sap.ui.model.json.JSONModel(obj);
                that.getView().setModel(sRequest, "Item");
            },
            onReadEbeln: function () {

                var oModel = this.getOwnerComponent().getModel();
                var sPath = "/header1Set"; //Odata entity set path
                var that = this;

                //Do the call to BE and create the data binding model
                oModel.read(`/header1Set`, {
                    success: function (oData) {
                        var sRequest = new sap.ui.model.json.JSONModel(oData.results);
                        that.getView().setModel(sRequest, "Purchase");

                    },
                    error: function (Error) {
                    }
                });

            },

            onReadMatnr: function () {

                var oModel = this.getOwnerComponent().getModel();
                var sPath = "/matnrHelpSet"; //Odata entity set path
                var that = this;

                //Do the call to BE and create the data binding model
                oModel.read(sPath, {
                    success: function (oData) {
                        var sRequest = new sap.ui.model.json.JSONModel(oData.results);
                        that.getView().setModel(sRequest, "material");
                    },
                    error: function (Error) {
                    }
                });

            },


            onGo: function () {
                this.getView().byId("Table").setVisible(true);
            },

            onClose: function () {
                this.getView().byId("productInput1").setValue('');
            },

            onAdd: function () {
                var oTable = this.getView().getModel("Item").getData();
                // var oModel = oTable.getModel().getProperty();
                this.Counter++;

                var obj1 = [{
                    index: this.Counter,
                    Matnr: "New Item",
                    Maktx: "New Item",
                    Ernam: "New Item",
                    Laeda: "New Item",
                    Status: "New Item",
                }];

                oTable.push(obj1)
                var sRequest = new sap.ui.model.json.JSONModel(oTable);
                this.getView().setModel(sRequest, "Item");
                // oTable.getModel().setProperty(oModel);
            },




            onSave: function (oData) {

                var oModel = this.getOwnerComponent().getModel();
                
                var oTable = this.getView().getModel("Item").getData();
                var oEbeln = this.getView().byId("productInput").getValue()
                 var oDatePicker = this.getView().byId("DatePicker").getValue()

            //     var header = {};
            //    header.Ebeln = oEbeln;
            // //    header.Date = oDatePicker;

            //     var array = [];
            //     array.push(oTable);


            //     header.hdrtoitemnav = array;

            var requestBody = {
                Ebeln: oEbeln, //Header
                hdrtoitemnav: [] // Item
            };

             //Create the item section for the deep entity call
             for (var i = 0; i < oTable.length; i++) {
                var oTempItems = {};
                // oTempItems.NAVNUM = (oNavnum == "") ? '&&' : oNavnum;
                // oTempItems.WIP_OUT = oItems[i].WIP_OUT;
                // oTempItems.AUFNR = oItems[i].AUFNR;
                // oTempItems.LGORT = this.checkFieldSplit(sap.ui.getCore().byId("partenza").getValue());
                // oTempItems.UMLGO = this.checkFieldSplit(sap.ui.getCore().byId("arrivo__").getValue());
                // oTempItems.MATNR = oItems[i].MATNR;
                // oTempItems.MAKTX = oItems[i].MAKTX;
                // oTempItems.ARBPL = oItems[i].ARBPL;
                // oTempItems.MENGE = oItems[i].MENGE;
                // oTempItems.MEINS = oItems[i].MEINS;
                // oTempItems.ERDAT = new Date(sap.ui.getCore().byId("creazione").getValue());

                oTempItems.Matnr = oTable[i].Matnr;
                oTempItems.Maktx = oTable[i].Maktx;
                oTempItems.Ernam = oTable[i].Ernam;
                oTempItems.Laeda = oTable[i].Laeda;
                oTempItems.Status = oTable[i].Status;

                requestBody.hdrtoitemnav.push(oTempItems);
                
            }
               
                oModel.create(`/saveHelpSet`,requestBody, {
                    success: function (odata) {
                        MessageBox.success("Created successfully!", {

                        });
                        //oModel.refresh(true);
                    },
                    error: function (err) {
                        try {
                            const errorJson = JSON.parse(err.responseText);
                            MessageBox.error(errorJson.error.message.value);    
                        }catch (e){
                            MessageBox.error(err.message);    
                        } 



                    }
                })

            
            },

            deleteRow: function (oEvent) {
                
                var data = this.getView().getModel("Item").getData();
                var deleteRecord = oEvent.getSource().getBindingContext("Item").getPath().split('/')[1];
                data.splice(parseInt(deleteRecord, 10), 1);
                this.getView().getModel("Item").setData(data);
            },


            onValueHelpRequest: function (oEvent) {
                var sInputValue = oEvent.getSource().getValue(),
                    oView = this.getView();
                var that = this;

                if (!this._pValueHelpDialog) {
                    this._pValueHelpDialog = Fragment.load({
                        id: oView.getId(),
                        name: "Task2.task2.view.fragment.ValueHelpDialog",
                        controller: this
                    }).then(function (oDialog) {
                        oView.addDependent(oDialog);
                        return oDialog;
                    });
                }
                this._pValueHelpDialog.then(function (oDialog) {
                    that.onReadEbeln();
                    oDialog.open(sInputValue);
                });
            },


            onValueHelpSearch: function (oEvent) {
                var sValue = oEvent.getParameter("value");
                var oFilter = new Filter("Ebeln", FilterOperator.Contains, sValue);
            },

            onValueHelpClose: function (oEvent) {
                var oSelectedItem = oEvent.getParameter("selectedItem");
                if (!oSelectedItem) {
                    return;
                }

                this.getView().byId("productInput").setValue(oSelectedItem.getTitle());
            },



            onValueHelpRequest1: function (oEvent) {
                var that = this;
                var sInputValue = oEvent.getSource().getValue(),
                    oView = this.getView();
                this.SelectedIndex = oEvent.getSource().getBindingContext("Item").getObject().index;

                if (!this._pValueHelpDialog1) {
                    this._pValueHelpDialog1 = Fragment.load({
                        id: oView.getId(),
                        name: "Task2.task2.view.fragment.ValueHelpDialog1",
                        controller: this
                    }).then(function (oDialog) {
                        oView.addDependent(oDialog);
                        return oDialog;
                    });
                }
                this._pValueHelpDialog1.then(function (oDialog) {
                    that.onReadMatnr();
                    oDialog.open(sInputValue);

                });
            },

            // onValueHelpSearch1: function (oEvent) {
            //     var sValue = oEvent.getParameter("value");
            //     var oFilter = new Filter("Matnr", FilterOperator.Contains, sValue);

            // },

            onValueHelpClose1: function (oEvent) {
                var that = this;

                var oSelectedItem = oEvent.getParameter("selectedItem");
                if (!oSelectedItem) {
                    return;
                }
                this.getView().byId("productInput1").setValue(oSelectedItem.getTitle());
                var oModel = this.getOwnerComponent().getModel();
                var oEbeln = this.getView().byId("productInput").getValue();
                var oMatnr = oSelectedItem.getTitle();
                var sPath1 = `/itemHelpSet(Matnr='${oMatnr}',Ebeln='${oEbeln}')`;
                var items = this.getView().getModel("Item").getData();

                var selIndex = this.SelectedIndex;
                oModel.read(sPath1, {
                    success: function (oData) {
                        for (var i = 0; i < items.length; i++) {
                            if (items[i].index === selIndex) {

                                items[i].Matnr = oData.Matnr;
                                items[i].Maktx = oData.Maktx;
                                items[i].Ernam = oData.Ernam;
                                items[i].Laeda = oData.Laeda;
                                items[i].Status = oData.Status;
                            }
                        }
                        var sRequestTab = new sap.ui.model.json.JSONModel(items);
                        that.getView().setModel(sRequestTab, "Item");
                    },
                    error: function (Error) {
                    }

                });

            },



            MatnrChange: function (oEvent) {
                this.allItems = oEvent.getSource().getBindingContext("Item").getObject();

            }

        });
    });

     