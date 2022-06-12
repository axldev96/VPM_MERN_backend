import Patient from '../models/Patient.js';

const getPatients = async (req, res) => {
  const patients = await Patient.find()
    .where('veterinarian')
    .equals(req.veterinarian._id);

  res.json(patients);
};

const addPatient = async (req, res) => {
  const patient = new Patient(req.body);
  patient.veterinarian = req.veterinarian._id;

  try {
    const patientSaved = await patient.save();

    return res.json(patientSaved);
  } catch (error) {
    console.log(error);
  }
};

const getPatient = async (req, res) => {
  const { id } = req.params;

  const patient = await Patient.findById(id);

  if (!patient) {
    return res.status(404).json({ msg: 'Patient not found' });
  }

  if (patient.veterinarian._id.toString() !== req.veterinarian._id.toString()) {
    return res.json({ msg: 'Unauthorized' });
  }

  return res.json(patient);
};
const updatePatient = async (req, res) => {
  const { id } = req.params;

  const patient = await Patient.findById(id);

  if (!patient) {
    return res.status(404).json({ msg: 'Patient not found' });
  }

  if (patient.veterinarian._id.toString() !== req.veterinarian._id.toString()) {
    return res.json({ msg: 'Unauthorized' });
  }

  // update patient
  patient.name = req.body.name || patient.name;
  patient.owner = req.body.owner || patient.owner;
  patient.email = req.body.email || patient.email;
  patient.date = req.body.date || patient.date;
  patient.symptom = req.body.symptom || patient.symptom;

  try {
    const patientSaved = await patient.save();

    return res.json(patientSaved);
  } catch (error) {
    console.log(error);
  }
};

const deletePatient = async (req, res) => {
  const { id } = req.params;

  const patient = await Patient.findById(id);

  if (!patient) {
    return res.status(404).json({ msg: 'Patient not found' });
  }

  if (patient.veterinarian._id.toString() !== req.veterinarian._id.toString()) {
    return res.json({ msg: 'Unauthorized' });
  }

  try {
    await patient.deleteOne();

    return res.json({ msg: 'Patient deleted' });
  } catch (error) {
    console.log(error);
  }
};

export { addPatient, getPatients, getPatient, updatePatient, deletePatient };
