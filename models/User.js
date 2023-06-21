const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator')

const userSchema = mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: function (value) {
                const emailRegex = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;
                return emailRegex.test(value);
            },
            message: 'Le champ email doit être un email valide.'
        } 
    },
    password: {
        type: String,
        required: true,
        validate: {
            validator: function (value) {
                const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&()])[A-Za-z\d@$!%*?&]{8,}$/;
                return passwordRegex.test(value);
            },
            message: 'Le mot de passe doit avoir au moins 8 caractères et inclure au moins une minuscule, une majuscule, un chiffre et un caractère spécial.'
        }
    }
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);