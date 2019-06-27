import moment from 'moment';
import * as query from '../until/common';

export const importProduct = async (req,res) =>{
    let dataRes = {};
    let userId = req.session.userId;
    if(userId == null){
        dataRes = {
            code : "NOK",
            message : "Unauthorized",
            data : false
         }
        res.status(401).send(dataRes)
        return;
    }
    let params = Object.assign({}, req.body);
    let date = moment(params.date, 'DD-MM-YYYY');
    if (!date.isValid()) {
        dataRes = {
            code : "NOK",
            message : "Date is error, please set format DD-MM-YYYY",
            data : false
         }
        res.json(dataRes);
        return;
    }
    let modelDetail = {
       WorkingDate : params.date,
       ProductID : params.productId,
       remain_qty : params.qty,
       exported_qty : 0
    }
    const countModelDetail = await query.queryNormal("SELECT COUNT(*) AS numOf FROM productdtl WHERE WorkingDate = '"+modelDetail.WorkingDate+"' AND ProductID = "+modelDetail.ProductID+"");
    if (countModelDetail) {
        if (countModelDetail[0].numOf > 0) {
            let equalUpd = await query.queryNormal("UPDATE productdtl SET remain_qty = remain_qty + "+modelDetail.remain_qty+" WHERE WorkingDate = '"+modelDetail.WorkingDate+"' AND ProductID = "+modelDetail.ProductID+"")
            if (equalUpd) {
                dataRes = {
                    code : "OK",
                    message : "Update productdtl success",
                    data : true
                 }
                 res.json(dataRes);
            } else {
                dataRes = {
                    code : "NOK",
                    message : "ERROR when query update productdtl",
                    data : false
                 }
                 res.json(dataRes);
            }
        } else {
            let equalIns = await query.queryInsert("INSERT INTO productdtl SET ?", modelDetail)
            if (equalIns) {
                dataRes = {
                    code : "OK",
                    message : "Insert productdtl success",
                    data : true
                 }
                 res.json(dataRes);
            } else {
                dataRes = {
                    code : "NOK",
                    message : "ERROR when query insert productdtl",
                    data : false
                 }
                res.json(dataRes);
            }
        }
    } else {
        dataRes = {
            code : "NOK",
            message : "ERROR when query select count productdtl",
            data : false
         }
         res.json(dataRes);
    }   
 };

 export const exportProduct = async (req,res) =>{
    let dataRes = {};
    let userId = req.session.userId;
    if(userId == null){
        dataRes = {
            code : "NOK",
            message : "Unauthorized",
            data : false
         }
        res.status(401).send(dataRes)
        return;
    }
    let params = Object.assign({}, req.body);
    let date = moment(params.date, 'DD-MM-YYYY');
    if (!date.isValid()) {
        dataRes = {
            code : "NOK",
            message : "Date is error, please set format DD-MM-YYYY",
            data : false
         }
        res.json(dataRes);
        return;
    }
    let modelDetail = {
       WorkingDate : params.date,
       ProductID : params.productId,
       remain_qty : 0,
       exported_qty : params.qty
    }
    const countModelDetail = await query.queryNormal("SELECT COUNT(*) AS numOf FROM productdtl WHERE WorkingDate = '"+modelDetail.WorkingDate+"' AND ProductID = "+modelDetail.ProductID+"",null);
    if (countModelDetail) {
        if (countModelDetail[0].numOf > 0) {
            let equalUpd = await query.queryNormal("UPDATE productdtl SET exported_qty = exported_qty + "+modelDetail.exported_qty+" WHERE WorkingDate = '"+modelDetail.WorkingDate+"' AND ProductID = "+modelDetail.ProductID+"")
            if (equalUpd) {
                dataRes = {
                    code : "OK",
                    message : "Update productdtl success",
                    data : true
                 }
                 res.json(dataRes);
            } else {
                dataRes = {
                    code : "NOK",
                    message : "ERROR when query update productdtl",
                    data : false
                 }
                 res.json(dataRes);
            }
        } else {
            let equalIns = await query.queryInsert("INSERT INTO productdtl SET ?", modelDetail)
            if (equalIns) {
                dataRes = {
                    code : "OK",
                    message : "Insert productdtl success",
                    data : true
                 }
                 res.json(dataRes);
            } else {
                dataRes = {
                    code : "NOK",
                    message : "ERROR when query insert productdtl",
                    data : false
                 }
                res.json(dataRes);
            }
        }
    } else {
        dataRes = {
            code : "NOK",
            message : "ERROR when query select count productdtl",
            data : false
         }
         res.json(dataRes);
    }   
 };

 export const getModelResult = async (req,res) =>{
    let dataRes = {};
    let userId = req.session.userId;
    if(userId == null){
        dataRes = {
            code : "NOK",
            message : "Unauthorized",
            data : false
         }
        res.status(401).send(dataRes)
        return;
    }
    let dateStr = req.params.date;
    let date = moment(dateStr, 'DD-MM-YYYY');
    if (!date.isValid()) {
        dataRes = {
            code : "NOK",
            message : "Date is error, please set format DD-MM-YYYY",
            data : false
         }
        res.json(dataRes);
        return;
    }

    let result = [];
    let lstModel = await query.queryNormal("SELECT * FROM product");
    if (lstModel) {
        for (let i =0; i <lstModel.length; i++){
            let data = {
                modelId : lstModel[i].id,
                status : "WAITING",
                color : "8E1E20",
                remain : 0,
                exported : 0
            };
            let modelDetail = await query.queryNormal("SELECT * FROM productdtl WHERE WorkingDate = '"+dateStr+"' AND ProductID = "+lstModel[i].id+"");
            if (modelDetail && modelDetail.length > 0) {
                if (modelDetail[0].remain_qty > 24 ) {
                    data.status = "AVAILABLE";
                    data.color = "DCD800";
                } else {
                    data.status = "WAITING";
                    data.color = "8E1E20";
                }
                data.remain = modelDetail[0].remain_qty;
                data.exported = modelDetail[0].exported_qty;
            }
            result.push(data);
        }
    } else {
        dataRes = {
            code : "NOK",
            message : "Get list model is error",
            data : false
         }
        res.json(dataRes);
    }
    dataRes = {
        code : "OK",
        message : "getModelResult success",
        data : result
     }
     res.json(dataRes);
 }