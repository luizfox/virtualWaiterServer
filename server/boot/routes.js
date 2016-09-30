// nova rota

module.exports = function(app) {
  var router = app.loopback.Router();
  router.get('/ping', function(req, res) {
		// pode ser chamado assim tbm: http://localhost:3000/api/orders?filter[include]=menu
		// olhar o projeto loopback-example-model-relations
		app.models.Order.find({include:'menu'}, function(err, orders) {
			    if (err) {
						console.log('bugou');
					}
					res.send({orders:orders} );
					// somatorio:{$sum: [ "$final", "$midterm" ] } ;
		});
  });

 var bill = function(req, res, table, answer) {
	 app.models.Order2.find({
		 where: {table: table}
	 },function(err, result) {
		 if(err) {
			 console.log(JSON.stringify(err));
		 } else {
			 answer.push ({bill:result});
			 res.send( answer );
		 }
		 }
	 );
 };

	// we should get the table from the parameters
	router.get('/checkbill/:table', function(req, res) {
		// console.log('chamando com a mesa ' + req.params.table);
		var orderCollection = app.models.Order2.getDataSource().connector.collection(app.models.Order2.modelName);
		orderCollection.aggregate([
			{ $match : { table : req.params.table } },
  		{$group: {
    		_id: { table: "$table"},
    		total: { $sum: {$multiply:["$qty","$item.price"] } }
  		}
		}],function(err, groupByRecords) {
	  	if(err) {
				console.log(JSON.stringify(err));
	  	} else {
				var total = [{total: groupByRecords}];
				bill(req, res, req.params.table, total);
				//res.send(groupByRecords);
	  	}
			}
		);
	});

  app.use(router);
};
