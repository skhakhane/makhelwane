var mongoose = require('mongoose');   

var incsSchema = new mongoose.Schema({
	picture: String,
	comment: String,
	//gps: [{
		latitude: Number,
	    longitude: Number,
     //   }],
	capture: String, 
	createdAt: String,
	assignee: String,
	contact: String,
	status: String,
	
});

var usersSchema = new mongoose.Schema({
	name: String,
	surname: String,
	email: String,
	password:String,
    role: String,
	//createdAt: String,
	//assignee: String,
	//contact: String,
	//status: String,
	
});

var statsSchema = new mongoose.Schema({
	name: String,
	frequency: Number,	
});



mongoose.model('Incs', incsSchema);
mongoose.model('Users', usersSchema);
mongoose.model('Stats', statsSchema);