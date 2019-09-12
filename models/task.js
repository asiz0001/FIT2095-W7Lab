let mongoose = require('mongoose');

let taskSchema = mongoose.Schema({
    name: String,
    assignedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Developer"
    },
    due: Date,
    status: {
        type: String,
        validate: {
            validator: function(value) {
                if (value === "Complete" || value === "InProgress") 
                    return true;
                else
                    return false;
            },
            message: "Value must be Complete or InProgress"
        }
    },
    desc: String
});

let taskModel = mongoose.model("Task", taskSchema);

module.exports = taskModel;