const responseObj = (callback, statusCode, message, data) => {
  console.log("Creating responseObj");
  return callback(null, {
    statusCode,
    body: JSON.stringify({
      message,
      data
    })
  });
};

module.exports = {
  responseObj
};
