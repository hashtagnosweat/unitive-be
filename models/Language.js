const mongoose = require('mongoose');


const LanguageSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Can't be blank"]
      },
    flag_code: {
        type: String,
        required: [true, "Can't be blank"],
        lowercase: true,
      },
    
})

const Language = mongoose.model('Language', LanguageSchema);

module.exports = Language