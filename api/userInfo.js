"use strict";

const uuid = require("uuid");
const AWS = require("aws-sdk");
const moment = require("moment");

const { common } = require("../util");
AWS.config.setPromisesDependency(require("bluebird"));
const dynamoDb = new AWS.DynamoDB.DocumentClient();

const submit = async (event, context, callback) => {
  const requestBody = JSON.parse(event.body);
  const firstName = requestBody.firstName;
  const lastName = requestBody.lastName;
  const password = requestBody.password;
  const email = requestBody.email;

  validateParams(firstName, lastName, password, email, callback);
  const userDetails = userInfomation(firstName, lastName, password, email);

  try {
    submitUserInfo(userDetails);
    return common.responseObj(
      callback,
      200,
      `Sucessfully submitted user information with email ${email}`,
      userDetails.id
    );
  } catch (err) {
    return common.responseObj(
      callback,
      500,
      `Failed submitting user information with email ${email}`,
      userDetails.id
    );
  }
};

const validateParams = (firstName, lastName, password, email, callback) => {
  if (!firstName || !lastName || !password || !email) {
    callback(null, {
      statusCode: 404,
      body: JSON.stringify({
        message: "Missing parameters"
      })
    });
    return;
  }

  if (
    typeof firstName !== "string" ||
    typeof lastName !== "string" ||
    typeof password !== "string" ||
    typeof email !== "string"
  ) {
    callback(null, {
      statusCode: 412,
      body: JSON.stringify({
        message: "validation failed for the params"
      })
    });
    return;
  }
};

const submitUserInfo = userInfo => {
  console.log("Submitting userInfo");
  const UserInfo = {
    TableName: process.env.USER_INFO_TABLE,
    Item: userInfo
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
    updatedAt: timestamp
  };
};

const onScanUsers = async (err, data, callback) => {
  console.log("Entered the getUsersList Function", data);
  if(err) {
    return common.responseObj(
      callback,
      500,
      "Failed fetching user information for `${email}`"
    );
  } else {
    console.log("Scan succeeded.", data);
    return common.responseObj(
      callback,
      200,
      "Successfully fetched user information for all test emails",
      data
    );

  }
};

const fetchUsers = (event, context, callback) => {
  var params = {
    TableName: process.env.USER_INFO_TABLE
  };

  console.log("Scanning userInfo table.", params);

  dynamoDb.scan(params, (err, data) => onScanUsers(err, data, callback));
};

const fetchByUserEmail = (event, context, callback) => {
  const email = event.pathParameters.email;
  var params = {
    TableName: process.env.USER_INFO_TABLE,
    Key: {
      email,
    },
  };

  console.log("Scanning userInfo table.", params);

  dynamoDb.get(params).promise()
  .then(res => {
    let message = `Successfully fetched user information for ${email}`;
    if(!res.Item) {
      message = "No User Information found for this email. Please create an account and sign in"
    }
    return common.responseObj(
      callback,
      200,
      message,
      res
    );
  }).catch(error => {
    console.log(error);
    return common.responseObj(
      callback,
      500,
      "Failed fetching user information with email"
    );
  })
};

module.exports = {
  submit,
  fetchUsers,
  fetchByUserEmail
};
