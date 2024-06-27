import mongoose from "mongoose";
//Models are defined through the Schema interface.

const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
        trim: true
    },
    email:{
        type: String,
        required: true,
        unique: true
    },
    password:{
        type: String,
        require: true,
    },
    phone: {
        type: String,
        required: true
    },
    address:{
        type: String,
        required: true
    },
    totalSpent:{
        type: Number,
        require: false,
        default: 0
    },
    role:{
        type: Number,
        default: 0
    },
},
    {timestamps: true}
);

export default mongoose.model('Users', userSchema, 'Users');
