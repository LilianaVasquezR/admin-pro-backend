const { Schema, model } = require('mongoose');
// definicion del esquema
const MedicoSchema = Schema({
    nombre:{
        type: String,
        require: true
    },
    img: {
        type: String  
    },
    usuario: {
        type:Schema.Types.ObjectId,
        ref:'Usuario',
        require: true
    },
    hospital: {
        type:Schema.Types.ObjectId,
        ref:'Hospital',
        require: true
    },

 });// para que este nombre aparezca en la base de datos collection: 'hospitales'


MedicoSchema.method('toJSON', function () {  // para que no se muetre _id por defaul que lo pone mongo
   const { __v, ...object } = this.toObject();
   return object;
})


//implementar el modelo
module.exports = model('Medico', MedicoSchema);