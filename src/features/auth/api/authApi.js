import { SignupInputSchema } from '../auth.types';
import { AuthResponseSchema } from '../auth.types';

const USERS_STORAGE_KEY = 'tradelink-auth-users';

const wait = (ms = 450) => new Promise((resolve) => setTimeout(resolve, ms));

const seedUsers = [
  {
    user_id: 'user-001',
    username: 'angela.trader',
    user_fname: 'Angela',
    user_lname: 'Mwangi',
    user_email: 'angela@tradelink.dev',
    user_gender: 'female',
    user_role: 'buyer',
    user_password: 'Password123!',
  },
];

const readUsers = () => {
  const raw = localStorage.getItem(USERS_STORAGE_KEY);
  if (!raw) {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(seedUsers));
    return [...seedUsers];
  }

  try {
    return JSON.parse(raw);
  } catch {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(seedUsers));
    return [...seedUsers];
  }
};

const saveUsers = (users) => {
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
};

const toPublicUser = ({ user_password: _user_password, ...user }) => user;

const buildAuthPayload = (user) => {
  return AuthResponseSchema.parse({
    access_token: `mock-access-${user.user_id}`,
    refresh_token: `mock-refresh-${user.user_id}`,
    user: toPublicUser(user),
  });
};

/**
 * @param {{ email: string, password: string }} credentials
 * @returns {Promise<import('../auth.types').AuthResponse>}
 */
export const login = async (credentials) => {
  await wait();
  const users = readUsers();
  const user = users.find(
    (candidate) =>
      candidate.user_email.toLowerCase() === String(credentials.email).toLowerCase() &&
      candidate.user_password === credentials.password
  );

  if (!user) {
    throw new Error('Invalid email or password.');
  }

  return buildAuthPayload(user);
};

/**
 * @param {import('../auth.types').SignupInput} payload
 * @returns {Promise<import('../auth.types').AuthResponse>}
 */
export const signup = async (payload) => {
  await wait();
  const parsed = SignupInputSchema.parse(payload);
  const users = readUsers();

  const emailTaken = users.some(
    (candidate) => candidate.user_email.toLowerCase() === parsed.user_email.toLowerCase()
  );

  if (emailTaken) {
    throw new Error('An account with this email already exists.');
  }

  const usernameTaken = users.some(
    (candidate) => candidate.username.toLowerCase() === parsed.username.toLowerCase()
  );

  if (usernameTaken) {
    throw new Error('That username is already taken.');
  }

  const nextUser = {
    user_id: `user-${Date.now()}`,
    username: parsed.username,
    user_fname: parsed.user_fname,
    user_lname: parsed.user_lname,
    user_email: parsed.user_email,
    user_gender: parsed.user_gender,
    user_role: parsed.user_role,
    user_password: parsed.user_password,
  };

  users.push(nextUser);
  saveUsers(users);

  return buildAuthPayload(nextUser);
};

export const requestPasswordReset = async ({ email }) => {
  await wait(500);
  const users = readUsers();
  const found = users.some(
    (candidate) => candidate.user_email.toLowerCase() === String(email).toLowerCase()
  );

  if (!found) {
    throw new Error('No account was found with that email address.');
  }

  return {
    message: 'Reset link sent.',
  };
};

export const logout = async () => {
  await wait(150);
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
};
