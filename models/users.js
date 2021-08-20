const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: { type: String, required: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    comments: { 
        type: "array", 
        required: true, 
        uniqueItems: false, 
        items: { type: String } 
    },
    logs: {type: "object", additionalProperties: 
        { 
            clicks: { type: Number, default: 0 }, 
            views: { type: Number, default: 0 }, 
            visited: { type: String, default: "" }
        }
    },
},  {timestamps: true});

const User = mongoose.model("Users", userSchema);
module.exports = User;
