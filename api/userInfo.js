"use strict";

const uuid = require("uuid");
const moment = require("moment");

const { common, db } = require("../util");
const dynamoDb = db.dbConnection();

const tableName = db.getTable();

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
      `Sucessfully submitted user information with email`,
      "this_is_test_success_id"
    );
  } catch (err) {
    return common.responseObj(
      callback,
      500,
      `Failed submitting user information with email`,
      "this_is_test_fail_id"
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
    TableName: tableName,
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
  submit
};
