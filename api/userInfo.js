'use strict';

const uuid = require('uuid');
const AWS = require('aws-sdk'); 
const moment = require('moment');

AWS.config.setPromisesDependency(require('bluebird'));

const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.submit = async (event, context, callback) => {
  const requestBody = JSON.parse(event.body);
  const firstName = requestBody.firstName;
  const lastName = requestBody.lastName;
  const password = requestBody.password;
  const email = requestBody.email;

  validateParams(firstName, lastName, password, email, callback);
  const userDetails = userInfomation(firstName, lastName, password, email);

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

const validateParams = (firstName, lastName, password, email, callback) => {
  if (!firstName || !lastName || !password || !email) {
    callback(null, {
      statusCode: 404,
      body: JSON.stringify({
        message: 'Missing parameters'
      })
    });
    return;
}

  if (typeof firstName !== 'string' || 
      typeof lastName !== 'string' || 
      typeof password !== 'string' || 
      typeof email !== 'string') {
        callback(null, {
          statusCode: 412,
          body: JSON.stringify({
            message: 'validation failed for the params'
          })
        });
        return;
  }

}

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

const userInfomation = (firstName, lastName, password, email) => {
  const timestamp = moment().format();
  return {
    id: uuid.v1(),
    firstName,
    lastName,
    password,
    email,
    submittedAt: timestamp,
    updatedAt: timestamp,
  };
};