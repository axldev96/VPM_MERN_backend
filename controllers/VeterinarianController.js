import Veterinarian from '../models/Veterinarian.js';
import generateJWT from '../helpers/generateJWT.js';
import generateId from '../helpers/generateId.js';
import emailRegister from '../helpers/emailRegister.js';
import emailForgetPassword from '../helpers/emailForgetPassword.js';

const register = async (req, res) => {
  const { email, name } = req.body;

  const userExist = await Veterinarian.findOne({ email });

  if (userExist) {
    const error = new Error('Already registered user');

    return res.status(400).json({ msg: error.message });
  }

  try {
    const veterinarian = new Veterinarian(req.body);

    const saveVet = await veterinarian.save();

    // send email token
    emailRegister({
      name,
      email,
      token: saveVet.token,
    });

    res.json(saveVet);
  } catch (error) {
    console.log(`Error: ${error}`);
  }
};

const confirm = async (req, res) => {
  const { token } = req.params;
  const confirmUser = await Veterinarian.findOne({ token });

  if (!confirmUser) {
    const error = new Error('Invalid token');

    return res.status(404).json({ msg: error.message });
  }

  try {
    confirmUser.token = null;
    confirmUser.confirmed = true;

    await confirmUser.save();

    res.json({ msg: 'User confirmed successfully' });
  } catch (error) {
    console.log('Error: ', error);
  }
};

const authenticate = async (req, res) => {
  const { email, password } = req.body;

  const user = await Veterinarian.findOne({ email });

  if (!user) {
    const error = new Error('User does not exist');
    return res.status(404).json({ msg: error.message });
  }

  if (!(await user.checkPassword(password))) {
    const error = new Error('Incorrect password');
    return res.status(403).json({ msg: error.message });
  } else {
    if (!user.confirmed) {
      const error = new Error('Unauthenticated user');
      return res.status(403).json({ msg: error.message });
    }
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateJWT(user._id),
    });
  }
};

const profile = (req, res) => {
  const { veterinarian } = req;
  res.json(veterinarian);
};

const forgetPassword = async (req, res) => {
  const { email } = req.body;

  const existVeterinarian = await Veterinarian.findOne({ email });

  if (!existVeterinarian) {
    const error = new Error('User does not exist');
    return res.status(400).json({ msg: error.message });
  }

  try {
    existVeterinarian.token = generateId();
    await existVeterinarian.save();

    // Sed email to reset password
    emailForgetPassword({
      email,
      name: existVeterinarian.name,
      token: existVeterinarian.token,
    });

    res.json({ msg: 'Token sent to email' });
  } catch (error) {
    console.log(error);
  }
};

const checkToken = async (req, res) => {
  const token = req.params.token;

  const validToken = await Veterinarian.findOne({ token });

  if (!validToken) {
    const error = new Error('Invalid token');
    return res.status(400).json({ msg: error.message });
  }

  res.json({ msg: 'Valid token' });
};

const newPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  const veterinarian = await Veterinarian.findOne({ token });

  if (!veterinarian) {
    const error = new Error('Invalid token');
    return res.status(400).json({ msg: error.message });
  }

  try {
    veterinarian.confirmed = true;
    veterinarian.token = null;
    veterinarian.password = password;

    await veterinarian.save();
    res.json({ msg: 'Password changed successfully' });
  } catch (error) {
    console.log(error);
  }
};

const updateProfile = async (req, res) => {
  const veterinarian = await Veterinarian.findById(req.params.id);

  if (!veterinarian) {
    const error = new Error('Error: Cannot find user');
    return res.status(400).json({ msg: error.message });
  }

  if (veterinarian.email !== req.body.email) {
    const existEmail = await Veterinarian.findOne({ email: req.body.email });

    if (existEmail) {
      const error = new Error('This email is already being used');
      return res.status(400).json({ msg: error.message });
    }
  }

  try {
    veterinarian.name = req.body.name;
    veterinarian.web = req.body.web;
    veterinarian.phone = req.body.phone;
    veterinarian.email = req.body.email;

    const veterinarianUpdated = await veterinarian.save();

    res.json(veterinarianUpdated);
  } catch (error) {
    console.log(error);
  }
};

const updatePassword = async (req, res) => {
  // raad  data
  const { id } = req.veterinarian;
  const { current_password, new_password } = req.body;

  // Check veterinarian
  const veterinarian = await Veterinarian.findById(id);

  if (!veterinarian) {
    const error = new Error('Error');
    return res.status(400).json({ msg: error.message });
  }

  // Check password
  if (await veterinarian.checkPassword(current_password)) {
    // Save on database
    veterinarian.password = new_password;
    await veterinarian.save();
    res.json({ msg: 'Password saved correctly' });
  } else {
    const error = new Error('Wrong Password');
    return res.status(400).json({ msg: error.message });
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
  updateProfile,
  updatePassword,
};
