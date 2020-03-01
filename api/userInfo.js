'use strict';

const uuid = require('uuid');
const AWS = require('aws-sdk'); 

AWS.config.setPromisesDependency(require('bluebird'));

const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.submit = async (event, context, callback) => {
  const requestBody = JSON.parse(event.body);
  const fullname = requestBody.fullname;
  const email = requestBody.email;

  if (typeof fullname !== 'string' || typeof email !== 'string') {
    console.error('Validation Failed');
    callback(new Error('Couldn\'t submit candidate because of validation errors.'));
    return;
  }

  const userDetails = userInfomation(fullname, email);

  try {
    submitUserInfo(userDetails)
    
    callback(null, {
      statusCode: 200,
      body: JSON.stringify({
        message: `Sucessfully submitted user information with email ${email}`,
        userId: userDetails.id
      })
    });
  } catch(err) {
    callback(null, {
      statusCode: 500,
      body: JSON.stringify({
        message: `Failed submitting user information with email ${email}`,
        userId: userDetails.id
      })
    });
  }

};

const submitUserInfo = userInfo => {
  console.log('Submitting userInfo');
  const UserInfo = {
    TableName: process.env.USER_INFO_TABLE,
    Item: userInfo,
  };

   return dynamoDb.put(UserInfo, function(err, data) {
    if (err) throw new Error(err);
    else return userInfo;
   });
    
};

const userInfomation = (fullname, email) => {
  const timestamp = new Date().getTime();
  return {
    id: uuid.v1(),
    fullname: fullname,
    email: email,
    submittedAt: timestamp,
    updatedAt: timestamp,
  };
};