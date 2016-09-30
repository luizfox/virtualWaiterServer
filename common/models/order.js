'use strict';

module.exports = function(Order) {
	// Metodo personalizado
	Order.status = function(cb) {
		var response = "então...";
    cb(null, response);
  };
  Order.remoteMethod(
    'status',
    {
      http: {path: '/status', verb: 'get'},
      returns: {arg: 'status', type: 'string'}
    }
  );
};
