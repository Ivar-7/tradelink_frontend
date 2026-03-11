import { Link } from 'react-router-dom';

/**
 * @param {{ title?: string, message?: string, actionLabel?: string, actionTo?: string }} props
 */
const EmptyState = ({ title = 'Nothing here yet', message = '', actionLabel, actionTo }) => {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-20 text-center">
      <div className="text-6xl opacity-30">📭</div>
      <h3 className="text-lg font-semibold text-foreground">{title}</h3>
      {message && <p className="max-w-sm text-sm text-muted">{message}</p>}
      {actionLabel && actionTo && (
        <Link
          to={actionTo}
          className="mt-2 rounded-lg bg-primary-600 px-5 py-2 text-sm font-medium text-white hover:bg-primary-700"
        >
          {actionLabel}
        </Link>
      )}
    </div>
  );
};

export default EmptyState;
