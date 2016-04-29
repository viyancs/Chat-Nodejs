var mongoose = require('mongoose');
 
module.exports = mongoose.model('Colors',{
    hex: String,
    name: String,
    rgb: String
});