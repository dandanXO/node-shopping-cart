var Productcc = require('../models/productSSD');
var mongoose =require('mongoose');
mongoose.connect('localhost:27017/shopping')
var productss = [
	new Productcc({
		imagePath:'https://upload.wikimedia.org/wikipedia/en/5/5e/Gothiccover.png',
		title: 'Gothic Video Game',
		description: 'Awesome Game!!',
		price: 50

	}),
	new Productcc({
		imagePath:'https://upload.wikimedia.org/wikipedia/en/5/5e/Gothiccover.png',
		title: 'Gothic Video Game3',
		description: 'Awesome Game!!',
		price: 60

	}),
	new Productcc({
		imagePath:'https://upload.wikimedia.org/wikipedia/en/5/5e/Gothiccover.png',
		title: 'Gothic Video Game6',
		description: 'Awesome Game!!',
		price: 70

	})
];

var done = 0;
for(var i = 0 ;i < productss.length; i++){
	productss[i].save(function(err,result){
		done++;
		if(done == productss.length){
			exit();
		}

	});

}
function exit(){

mongoose.disconnect();

}
