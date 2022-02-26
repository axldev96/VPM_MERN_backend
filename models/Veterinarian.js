import mongoose from "mongoose";
import bcrypt from "bcrypt";
import generateId from "../helpers/generateId.js";

const VeterinarianSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    default: null,
    trim: true,
  },
  web: {
    type: String,
    default: null,
    trim: true,
  },
  token: {
    type: String,
    default: generateId(),
  },
  confirmed: {
    type: Boolean,
    default: false,
  },
});

VeterinarianSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

VeterinarianSchema.methods.checkPassword = async function (formPasswd) {
  return await bcrypt.compare(formPasswd, this.password);
};

const Veterinarian = mongoose.model("Veterinarian", VeterinarianSchema);

export default Veterinarian;
