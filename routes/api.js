var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');   
var Incs = mongoose.model('Incs');
var Users = mongoose.model('Users');
var Stats = mongoose.model('Stats');

var fs = require('fs');
var multer  = require('multer');
var upload = multer({ dest: 'uploads' });
var CircularJSON = require('circular-json')


// img path



router.route('/users')

     
     .post(function(req, res){

			//var imgPath =  req.files[0].path;
			//imgPath = imgPath.replace("\\","/");

         	var user = new Users();
            
			user.name = req.body.name;
			user.surname = req.body.surname;
			user.password = req.body.password;
			user.email = req.body.email;
			
			user.save(function(err, users) {
				if (err){
					return res.send(500, err);
				}
				return res.send(JSON.stringify(users, null, 2));
			});
		})

     .get(function(req, res){
			Users.find({},function(err, users){
				if(err){
					return res.send(403, err);
				} 
				//var incss = JSON.stringify(incs);
				//

				//var jsonObj = incs;

				//jsonObj.put("locations", JSON.stringify(incs, null, 2));
                //console.log(JSON.stringify({"locations": incs}, null, 2));

				//res.send("users");

				return res.json(users);
			});
		});



router.route('/locations')

     
     //new image
     .post(upload.any(), function(req, res){

           // var contents = fs.readFileSync(req.files);
          // var jsonContent = JSON.parse(contents);

		//	var imgPath = jsonContent.path;
		
           res.send(req.files);
     
		})

     .get(function(req, res){
			Incs.find({},{latitude: 1, longitude:1},function(err, incs){
				if(err){
					return res.send(403, err);
				} 
				//var incss = JSON.stringify(incs);
				//

				//var jsonObj = incs;

				//jsonObj.put("locations", JSON.stringify(incs, null, 2));
                //console.log(JSON.stringify({"locations": incs}, null, 2));

				//return res.send(JSON.stringify({"locations": incs}));

				return res.json(incs);
			});
		});


router.route('/statistics')
	
		.get(function(req, res){
			
			Stats.find(function(err, stats){
				if(err){
					return res.send(403, err);
				}
				return res.send(JSON.stringify(stats, null, 2));
			});
		//res.send("ntokzoo");
		});


router.route('/incidents')

     
     //new incident
     .post(upload.any(),function(req, res){

			//var imgPath =  req.files[0].path;
			


			var imgPath = 'public/uploads/'+ req.body.capturer+'-'+getGMTa()+'.jpg';
            imgPath = imgPath.replace(" ","");
            imgPath = imgPath.replace(":","");
            imgPath = imgPath.replace(":","");
            base64_decode(req.body.picture, imgPath );

            var imgPatha = 'uploads/'+ req.body.capturer+'-'+getGMTa()+'.jpg';
            imgPatha = imgPatha.replace(" ","");
            imgPatha = imgPatha.replace(":","");
            imgPatha = imgPatha.replace(":","");


         	var incs = new Incs();
            
			

            console.log(req.body.picture);
            console.log(imgPath);
            console.log(imgPatha);
			// convert image to base64 encoded string
			//var base64str = base64_encode('kitten.jpg');
			//console.log(base64str);
			// convert base64 string back to image 

			//console.log(req.body.characterId);

			


            //incs.picture = 'http://10.254.1.62:8888/'+ imgPatha;
            incs.picture = 'http://192.168.8.102:8888/'+ imgPatha;		
			incs.comment = req.body.comment;
			//incs.latitude= Math.round(req.body.latitude * 100) / 100; 
			//incs.longitude =   Math.round(req.body.longitude* 100) / 100;
            incs.latitude = req.body.latitude;
            incs.longitude = req.body.longitude;
			//var loc = { latitude: req.body.latitude, longitude: req.body.longitude };
			//incs.gps.push(loc);

			incs.capture = req.body.capturer;
			incs.createdAt = getGMT();
			incs.assignee = "Null";
			incs.status = "Not assigned";
			
			incs.save(function(err, incs) {
				if (err){
					
					console.log(err);
					return res.send(500, err);
				}
			
				return res.send(JSON.stringify(incs, null, 2));
			});
		})

     //get all incidents	
	.get(function(req, res){
			Incs.find(function(err, incs){
				if(err){
					return res.send(403, err);
				}
				//var incss = JSON.stringify(incs);
				//console.log(JSON.stringify(incs, null, 2))
				return res.send(JSON.stringify(incs, null, 2));
			});
		});


router.route('/incidents/:id')
	//gets specified post
	.get(function(req, res){
		Incs.findById(req.params.id, function(err, incs){
			if(err){
				res.send(err);
			}
			return res.send(JSON.stringify(incs, null, 2));
		});
	}) 
	//updates specified user
	.put(function(req, res){
		Incs.findById(req.params.id, function(err, incs){
			if(err)
				res.send(err);

			//incs.picture = imgPath;
			//incs.comment = req.body.comment;
			//incs.latitude= req.body.latitude;
			//incs.longitude = req.body.longitude;
			
			//var loc = { latitude: req.body.latitude, longitude: req.body.longitude };
			//incs.location.push(loc);
			
			//incs.capturer = req.body.capturer;
			//incs.createdAt = req.body.createdAt;
			incs.assignee = req.body.name;
			//incs.status = req.body.status;

			incs.save(function(err, incs){
				if(err)
					res.send(err);

				res.send(JSON.stringify(incs, null, 2));
			});
		});
	})
	//deletes a user
	.delete(function(req, res) {
		Incs.remove({
			_id: req.params.id
		}, function(err) {
			if (err)
				res.send(err);
			res.json("deleted :(");
		});
	});


function base64_decode(base64str, file) {
    // create buffer object from base64 encoded string, it is important to tell the constructor that the string is base64 encoded
    var bitmap = new Buffer(base64str, 'base64');
    // write buffer to file
    fs.writeFileSync(file, bitmap);
    console.log('******** File created from base64 encoded string ********');
}



function getGMT(){

		//Calculating GMT time.
		
		var time = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
			
		var targetTime = new Date(time);
		var timeZoneFromDB = 6; //time zone value from database
		//get the timezone offset from local time in minutes
		var tzDifference = timeZoneFromDB * 60 + targetTime.getTimezoneOffset();
		//convert the offset to milliseconds, add to targetTime, and make a new Date
		var offsetTime = new Date(targetTime.getTime() + tzDifference * 60 * 1000).toISOString().replace(/T/, ' ').replace(/\..+/, '');
				
		time = offsetTime;
		return time;

}

function getGMTa(){

		//Calculating GMT time.
		
		var time = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
			
		var targetTime = new Date(time);
		var timeZoneFromDB = 6; //time zone value from database
		//get the timezone offset from local time in minutes
		var tzDifference = timeZoneFromDB * 60 + targetTime.getTimezoneOffset();
		//convert the offset to milliseconds, add to targetTime, and make a new Date
		var offsetTime = new Date(targetTime.getTime() + tzDifference * 60 * 1000).toISOString().replace(/T/, '-').replace(/\..+/, '');
				
		time = offsetTime;
		return time;

}

module.exports = router;
