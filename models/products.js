const mongoose = require('mongoose'); // Erase if already required
const bcrypt = require('bcrypt'); // Erase if already required
// Declare the Schema of the Mongo model
var productsSchema = new mongoose.Schema({
    productName:{
        type:String,
        required:true,
        unique:false,
    },
    price:{
        type:String,
        required:true,
        unique:true,
    },
    description:{
        type:String,
        required:true,
        unique:true,
    },
    productImage: {
        type: String,
         required: true
      },
},
{
    timestamps: true,
},);

productsSchema.pre('save', async function(next) {
    const salt = bcrypt.genSaltSync(10);
    this.password= await bcrypt.hash(this.password, salt);
     
});

productsSchema.methods.isPasswordMatched = async function (enteredPassword) {

return await bcrypt.compare(enteredPassword, this.password)
};
//Export the model
module.exports = mongoose.model('Product', productsSchema);