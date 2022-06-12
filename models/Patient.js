import mongoose from 'mongoose';

const PatientSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    owner: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      required: true,
      default: Date.now(),
    },
    symptom: {
      type: String,
      required: true,
    },
    veterinarian: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Veterinarian',
    },
  },
  {
    timestamps: true,
  }
);

const Patient = mongoose.model('Patient', PatientSchema);

export default Patient;
