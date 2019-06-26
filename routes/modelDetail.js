import moment from 'moment';
export const importProduct = async (req,res) =>{
    let userId = req.session.userId;
    if(userId == null){
        res.status(401).send('Unauthorized ')
        return;
    }

    let params = Object.assign({}, req.body);
    let date = moment(params.date, 'DD-MM-YYYY');
    if (!date) {
        res.json(false);
        console.log('Date fail');
        return;
    }
    let modelDetail = {
       WorkingDate : params.date,
       ProductID : params.productId,
       remain_qty : params.qty,
       exported_qty : 0
    }
    const query = async (sql, obj) => {
        return new Promise(resolve=>{
            if (obj) {
                db.query(sql,obj, function(err, results){
                    if (err) {
                        resolve(null)
                        throw err;
                    } 
                    resolve(JSON.parse(JSON.stringify(results)))
                });
            } else {
                db.query(sql, function(err, results){
                    if (err) {
                        resolve(null)
                        throw err;
                    } 
                    resolve(JSON.parse(JSON.stringify(results)))
                });
            }
        })
    }
    const countModelDetail = await query("SELECT COUNT(*) AS numOf FROM productdtl WHERE WorkingDate = '"+modelDetail.WorkingDate+"' AND ProductID = "+modelDetail.ProductID+"",null);
    if (countModelDetail && countModelDetail[0].numOf > 0) {
        await query("UPDATE productdtl SET remain_qty = remain_qty + "+modelDetail.remain_qty+" WHERE WorkingDate = '"+modelDetail.WorkingDate+"' AND ProductID = "+modelDetail.ProductID+"",null)
        
    } else {
        await query("INSERT INTO productdtl SET ?", modelDetail)
    }   
    res.json(true);
 };

 export const exportProduct = async (req,res) =>{
    let userId = req.session.userId;
    if(userId == null){
        res.status(401).send('Unauthorized ')
        return;
    }

    let params = Object.assign({}, req.body);
    let date = moment(params.date, 'DD-MM-YYYY');
    if (!date) {
        res.json(false);
        console.log('Date fail');
        return;
    }
    let modelDetail = {
       WorkingDate : params.date,
       ProductID : params.productId,
       remain_qty : 0,
       exported_qty : params.qty
    }

    const query = async (sql, obj) => {
        return new Promise(resolve=>{
            if (obj) {
                db.query(sql,obj, function(err, results){
                    if (err) {
                        resolve(null)
                        throw err;
                    } 
                    resolve(JSON.parse(JSON.stringify(results)))
                });
            } else {
                db.query(sql, function(err, results){
                    if (err) {
                        resolve(null)
                        throw err;
                    } 
                    resolve(JSON.parse(JSON.stringify(results)))
                });
            }
        })
    }
    const countModelDetail = await query("SELECT COUNT(*) AS numOf FROM productdtl WHERE WorkingDate = '"+modelDetail.WorkingDate+"' AND ProductID = "+modelDetail.ProductID+"",null);
    if (countModelDetail && countModelDetail[0].numOf > 0) {
        await query("UPDATE productdtl SET exported_qty = exported_qty + "+modelDetail.exported_qty+" WHERE WorkingDate = '"+modelDetail.WorkingDate+"' AND ProductID = "+modelDetail.ProductID+"",null)
        
    } else {
        await query("INSERT INTO productdtl SET ?", modelDetail)
    }   
    res.json(true);    
 };

 export const getModelResult = async (req,res) =>{
    const query = async (sql) => {
        return new Promise(resolve=>{
            db.query(sql, function(err, results){
                if (err) {
                    resolve(null)
                    throw err;
                } 
                resolve(JSON.parse(JSON.stringify(results)))
            });
        })
    }

    let dateStr = req.params.date;
    let date = moment(dateStr, 'DD-MM-YYYY');
    if (!date) {
        res.json(null);
        console.log('Date fail');
        return;
    }
    let result = [];
    let lstModel = await query("SELECT * FROM product");
    if (lstModel) {
        for (let i =0; i <lstModel.length; i++){
            let data = {
                modelId : lstModel[i].id,
                status : "WAITING",
                color : "8E1E20",
                remain : 0,
                exported : 0
            };
            let modelDetail = await query("SELECT * FROM productdtl WHERE WorkingDate = '"+dateStr+"' AND ProductID = "+lstModel[i].id+"");
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
    }
    res.json(result);
 }