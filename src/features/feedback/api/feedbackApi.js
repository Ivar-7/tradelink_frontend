import { UserFeedbackSchema } from '../feedback.types';

const FEEDBACK_STORAGE_KEY = 'tradelink-local-feedback';

const wait = (ms = 250) => new Promise((resolve) => setTimeout(resolve, ms));

const readFeedback = () => {
  const raw = localStorage.getItem(FEEDBACK_STORAGE_KEY);
  if (!raw) {
    return [];
  }

  try {
    return JSON.parse(raw);
  } catch {
    return [];
  }
};

const saveFeedback = (feedback) => {
  localStorage.setItem(FEEDBACK_STORAGE_KEY, JSON.stringify(feedback));
};

export const submitFeedback = async (payload) => {
  await wait();

  const entry = UserFeedbackSchema.parse({
    id: `fdb-${Date.now()}`,
    user_id: 'guest-user',
    type: payload.type,
    message: payload.message,
    created_at: new Date().toISOString(),
  });

  const feedback = readFeedback();
  feedback.unshift(entry);
  saveFeedback(feedback);

  return {
    success: true,
    item: entry,
  };
};
