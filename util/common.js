const responseObj = (callback, statusCode, message, data) => {
  console.log("Creating responseObj");
  return callback(null, {
    statusCode,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({
      message,
      data
    })
  });
};

module.exports = {
  responseObj
};
