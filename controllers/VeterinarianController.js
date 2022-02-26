import Veterinarian from '../models/Veterinarian.js';
import generateJWT from '../helpers/generateJWT.js';
import generateId from '../helpers/generateId.js';

const register = async (req, res) => {
  const { email } = req.body;

  const userExist = await Veterinarian.findOne({ email });

  if (userExist) {
    const error = new Error('already registered user');

    return res.status(400).json({ msg: error.message });
  }

  try {
    const veterinarian = new Veterinarian(req.body);

    const saveVet = await veterinarian.save();

    res.json(saveVet);
  } catch (error) {
    console.log(`Error: ${error}`);
  }
};

const confirm = async (req, res) => {
  const { token } = req.params;
  const confirmUser = await Veterinarian.findOne({ token });

  if (!confirmUser) {
    const error = new Error('invalid token');

    return res.status(404).json({ msg: error.message });
  }

  try {
    confirmUser.token = null;
    confirmUser.confirmed = true;

    await confirmUser.save();

    res.json({ msg: 'user confirmed successfully' });
  } catch (error) {
    console.log(error);
  }
};

const authenticate = async (req, res) => {
  const { email, password } = req.body;

  const user = await Veterinarian.findOne({ email });

  if (!user) {
    const error = new Error("User don't exist");
    return res.status(404).json({ msg: error.message });
  }

  if (!user.confirmed) {
    const error = new Error('Unauthenticated user');
    return res.status(403).json({ msg: error.message });
  }

  if (await user.checkPassword(password)) {
    res.json({ token: generateJWT(user._id) });
  } else {
    const error = new Error('Incorrect password');
    return res.status(403).json({ msg: error.message });
  }
};

const profile = (req, res) => {
  const { veterinarian } = req;
  res.json({ profile: veterinarian });
};

const forgetPassword = async (req, res) => {
  const { email } = req.body;

  const existVeterinarian = await Veterinarian.findOne({ email });

  if (!existVeterinarian) {
    const error = new Error("User don't exist");
    return res.status(400).json({ msg: error.message });
  }

  try {
    existVeterinarian.token = generateId();

    await existVeterinarian.save();

    res.json({ msg: 'Token sent to email' });
  } catch (error) {
    console.log(error);
  }
  console.log(email);
};

const checkToken = async (req, res) => {
  const token = req.params.token;

  const validToken = await Veterinarian.findOne({ token });

  if (!validToken) {
    const error = new Error('invalid token');
    return res.status(400).json({ msg: error.message });
  }

  res.json({ msg: 'token valid' });
};

const newPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  const veterinarian = await Veterinarian.findOne({ token });

  if (!veterinarian) {
    const error = new Error('invalid token');
    return res.status(400).json({ msg: error.message });
  }

  try {
    veterinarian.token = null;
    veterinarian.password = password;

    await veterinarian.save();
    res.json({ msg: 'password changed successfully' });
  } catch (error) {
    console.log(error);
  }
};

export {
  register,
  profile,
  confirm,
  authenticate,
  forgetPassword,
  checkToken,
  newPassword,
};
