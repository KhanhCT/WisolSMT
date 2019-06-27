import db from '../connectDB'
export const queryNormal = async (sql) => {
    return new Promise(resolve=>{
        db.query(sql, function(err, results){
            if (err) {
                console.log(err);
                resolve(null);
            }
            if (results) {
                resolve(JSON.parse(JSON.stringify(results)))
            } else {
                resolve(null);
            }
        });
    })
}
export const queryInsert = async (sql, obj) => {
    return new Promise(resolve=>{
        db.query(sql,obj, function(err, results){
            if (err) {
                console.log(err);
                resolve(null);
            }
            if (results) {
                resolve(results);
            } else {
                resolve(null);
            }
        });
    })
}