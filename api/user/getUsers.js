const { common, db } = require("../../util");
const dynamoDb = db.dbConnection();

const tableName = db.getTable();

const onScanUsers = async (err, data, callback) => {
    if(err) {
      return common.responseObj(
        callback,
        500,
        "Failed fetching all users information"
      );
    } else {
      return common.responseObj(
        callback,
        200,
        "Successfully fetched all users information",
        data
      );
  
    }
  };

const fetchUsers = (event, context, callback) => {
    var params = {
      TableName: tableName
    };
  
    console.log("Scanning userInfo table.", params);
  
    dynamoDb.scan(params, (err, data) => onScanUsers(err, data, callback));
  };

 module.exports = {
     fetchUsers
 } 