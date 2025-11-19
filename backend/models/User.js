import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
lastName: {
    type: String,
    required: true,
    maxLength: 20,
},

firstName: {
    type: String,
    required: true,
    maxLength: 20,
},
password: {
    type: String,
    required: true,
},

status: {
    type: String,
    maxLength: 100,
},

email: {
    type: String,
    required: true,
    unique: true,
},


profilePicture: {
    type: String,
default: "",
},
},
{
    timestamps:true,
}
);
const User = mongoose.model("User", userSchema)
export default User