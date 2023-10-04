import mongoose from "mongoose";


const userSchema = mongoose.Schema(
    {
        name: { type: "String", required: true, trim: true },
        image: { type: "String", default: " " },
        bio: { type: "String", default: null },
        address: { type: "String", trim: true, default: null },
        city: { type: "String", trim: true, default: null },
        state: { type: "String", trim: true, default: null },
        country: { type: "String", trim: true, default: null },
        language: { type: "String", trim: true, default: null },
        confirmPassword: { type: "String", trim: true },
        password: { type: "String", trim: true },
        email: { type: "String", required: true, trim: true, unique: true },
        loginOrSignupMethod: { type: String, required: true, trim: true, default: "CUSTOM" },
        providorName: String,
        googleId: String,
        facebookId: String,
    },
    { timestamps: true }
);



const User = mongoose.model("User", userSchema);

export default User