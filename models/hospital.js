const { Schema, model } = require('mongoose');
// definicion del esquema
const HospitalSchema = Schema({
    nombre:{
        type: String,
        require: true
    },
    img: {
        type: String  
    },
    usuario: {
        require: true,
        type:Schema.Types.ObjectId,
        ref:'Usuario'
    }
}, { collection: 'hospitales' });// para que este nombre aparezca en la base de datos collection: 'hospitales'


HospitalSchema.method('toJSON', function () {  // para que no se muetre _id por defaul que lo pone mongo
   const { __v, ...object } = this.toObject();
   return object;
})


//implementar el modelo
module.exports = model('Hospital', HospitalSchema);