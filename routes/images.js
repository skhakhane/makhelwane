var express = require('express');
var router = express.Router();
var path = require('path');

router.route('/:id')
        
     .get(function(req, res){

			console.log(req.params.id);
			res.sendFile(req.params.id, { root: path.join(__dirname, '../uploads') });
			//res.send('testing file send');
		});

module.exports = router;
