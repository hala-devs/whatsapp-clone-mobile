import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { io } from '../index.js';

const stripTrailingSlash = (value = '') => value.replace(/\/+$/, '');

const getForwardedHeader = (req, header) =>
  req.get(header)?.split(',')[0]?.trim();

const getPublicBaseUrl = (req) => {
  const envUrl = process.env.PUBLIC_BASE_URL?.trim();
  if (envUrl) {
    return stripTrailingSlash(envUrl);
  }

  const protocol = getForwardedHeader(req, 'x-forwarded-proto') || req.protocol;
  const host =
    getForwardedHeader(req, 'x-forwarded-host') || req.get('host') || 'localhost:8000';

  return `${protocol}://${host}`;
};

const isLocalHost = (host = '') =>
  ['localhost', '127.0.0.1', '::1'].includes(host.toLowerCase());

const ensureAbsoluteUrl = (req, rawValue) => {
  if (!rawValue) {
    return rawValue;
  }

  try {
    const parsed = new URL(rawValue);

    if (process.env.PUBLIC_BASE_URL || !isLocalHost(parsed.hostname)) {
      return parsed.toString();
    }

    const base = new URL(getPublicBaseUrl(req));
    parsed.protocol = base.protocol;
    parsed.host = base.host;
    return parsed.toString();
  } catch {
    const base = getPublicBaseUrl(req);
    const relativePath = rawValue.startsWith('/') ? rawValue : `/${rawValue}`;
    return `${base}${relativePath}`;
  }
};

const buildUploadUrl = (req, filename) =>
  ensureAbsoluteUrl(req, `/uploads/${filename}`);

const sanitizeUserForResponse = (user, req) => {
  if (!user) {
    return user;
  }

  const plainUser = user.toObject ? user.toObject() : { ...user };
  plainUser.profilePicture = ensureAbsoluteUrl(req, plainUser.profilePicture);
  delete plainUser.password;

  return plainUser;
};

export const register = async (req, res) => {
  const { lastName, firstName, email, password } = req.body;
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.json({ error: 'User already exist' });
  }

  const hashedPassword = await bcrypt.hash(password, 12);
  const profilePicture = buildUploadUrl(req, 'default-picture.jpg');
  const user = await User.create({
    lastName,
    firstName,
    email,
    password: hashedPassword,
    profilePicture,
  });
  const safeUser = sanitizeUserForResponse(user, req);
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: '1d',
  });
  io.emit('user_created', safeUser);

  res.send({
    message: 'User Created with success',
    user: safeUser,
    token,
  });
};
export const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    return res.json({ error: 'user does not exist' });
  }

  const isPasswordCorrect = await bcrypt.compare(password, user.password);

  if (!isPasswordCorrect) {
    return res.json({ error: 'invalid credentials' });
  }

  const safeUser = sanitizeUserForResponse(user, req);

  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
    expiresIn: '1d',
  });

  res.json({
    message: 'Login successful',
    user: safeUser,
    token,
  });
};

export const getFriends = async (req, res) => {
  const users = await User.find({
    _id: {
      $ne: req.userId,
    },
  }).select('-password');
  const safeUsers = users.map((user) => sanitizeUserForResponse(user, req));
  res.send(safeUsers);
};

export const updateUser = async (req, res) => {
  const userId = req.userId;
  const { lastName, firstName, status } = req.body;
  const user = await User.findByIdAndUpdate(
    userId,
    {
      lastName,
      firstName,
      status,
    },
    { new: true }
  );
  const safeUser = sanitizeUserForResponse(user, req);
  io.emit('user_update', safeUser);
  res.send(safeUser);
};
export const updateProfilePicture = async (req, res) => {
  const userId = req.userId;
  if (!req.file?.filename) {
    return res.status(400).json({ error: 'Profile picture is required' });
  }
  const profilePicture = buildUploadUrl(req, req.file.filename);

  const user = await User.findByIdAndUpdate(
    userId,
    { profilePicture },
    { new: true }
  );

  const safeUser = sanitizeUserForResponse(user, req);

  io.emit('user_updated', safeUser);
  console.log(safeUser);
  res.json(safeUser);
};
