exports.successResponse = (res, data) => {
    res.status(200).json({ success: true, data });
  };
  
  exports.errorResponse = (res, message) => {
    res.status(400).json({ success: false, message });
  };
  