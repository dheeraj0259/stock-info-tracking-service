const { common, db } = require('../../util');
const dynamoDb = db.dbConnection();

const tableName = db.getTable();

const onScanUsers = async (err, data, callback) => {
  if (err) {
    return common.responseObj(callback, 500, 'Failed fetching all users information');
  } else {
    return common.responseObj(callback, 200, 'Successfully fetched all users information', data);
  }
};

const users = (event, context, callback) => {
  var params = {
    TableName: tableName,
  };

  console.log('Scanning userInfo table.', params);

  dynamoDb.scan(params, (err, data) => onScanUsers(err, data, callback));
};

const userInfoByEmail = (event, context, callback) => {
  const email = event.pathParameters.email;
  var params = {
    TableName: tableName,
    Key: {
      email,
    },
  };

  dynamoDb
    .get(params)
    .promise()
    .then((res) => {
      let message = `Successfully fetched user information for ${email}`;
      if (!res.Item) {
        message = 'No User Information found for this email. Please create an account and sign in';
      }
      return common.responseObj(callback, 200, message, res);
    })
    .catch((error) => {
      console.log(error);
      return common.responseObj(callback, 500, 'Failed fetching user information with email');
    });
};

module.exports = {
  users,
  userInfoByEmail,
};
