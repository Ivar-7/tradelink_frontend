import { useState } from 'react';
import { submitFeedback } from '../api/feedbackApi';
import { mapError } from '../../../shared/utils/errorHandler';

const useFeedbackHook = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  const submit = async (payload) => {
    setLoading(true);
    setError(null);
    try {
      await submitFeedback(payload);
      setSubmitted(true);
    } catch (err) {
      const message = mapError(err);
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  return { loading, error, submitted, submit };
};

export default useFeedbackHook;
