const { Schema, model } = require('mongoose');

// definicion del esquema
const UsuarioSchema = Schema({

    nombre:{
        type: String,
        require: true
    },
    email: {
        type: String,
        require: true,
        unique: true
    },
    password: {
        type: String,
        require: true
    },
    img: {
        type: String  
    },
    role: {
        type: String,
        require: true,
        default: 'USER_ROLE'
    },
    google: {
        type: Boolean,
        default: false
    }
});


UsuarioSchema.method('toJSON', function () {  // para que no se muetre _id por defaul que lo pone mongo
   const { __v, _id, password, ...object } = this.toObject();
   object.uid = _id;
   return object;
})


//implementar el modelo
module.exports = model('Usuario', UsuarioSchema);