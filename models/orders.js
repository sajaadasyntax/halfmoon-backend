const mongoose = require('mongoose'); // Erase if already required
const bcrypt = require('bcrypt'); // Erase if already required
// Declare the Schema of the Mongo model
var ordersSchema = new mongoose.Schema({
    ordersList:{
        type:String,
        required:true,
        unique:false,
    },
    pricesList:{
        type:String,
        required:true,
        unique:false,
    },
    userID:{
        type:String,
        required:true,
        unique:true,
    },
    totalAmount:{
        type:String,
        required:true,
        unique:true,
    },
},
{
    timestamps: true,
},);

ordersSchema.pre('save', async function(next) {
    const salt = bcrypt.genSaltSync(10);
    this.password= await bcrypt.hash(this.password, salt);
     
});

ordersSchema.methods.isPasswordMatched = async function (enteredPassword) {

return await bcrypt.compare(enteredPassword, this.password)
};
//Export the model
module.exports = mongoose.model('Orders', ordersSchema);