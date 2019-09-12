let mongoose = require('mongoose');

let developerSchema = mongoose.Schema({
    name: {
        firstName: {
            type: String,
            required: true
        },
        lastName: String
    },
    level: {
        type: String,
        required: true,
        uppercase: true,
        validate: {
            validator: function(value) {
                if (value === "BEGINNER" || value === "EXPERT") 
                    return true;
                else
                    return false;
            },
            message: "Value must be Beginner or Expert"
        },
    },
    address: {
        state: String,
        suburb: String,
        street: String,
        unit: String
    }
});

let developerModel = mongoose.model("Developer", developerSchema);

module.exports = developerModel;