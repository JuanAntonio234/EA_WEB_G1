import zxcvbn from 'zxcvbn';
import './PasswordStrengthMeter.css';

interface Props {
  password: string;
}

const PasswordStrengthMeter = ({ password }: Props) => {
  const result = zxcvbn(password);
  const strength = result.score;

  const strengthLabels = ['Muy débil', 'Débil', 'Regular', 'Fuerte', 'Muy fuerte'];

  return (
    <div className="password-meter">
      <div className={`strength-bar strength-${strength}`} />
      <p className="strength-label">{strengthLabels[strength]}</p>
      {result.feedback.suggestions.length > 0 && (
        <ul className="feedback-list">
          {result.feedback.suggestions.map((s, i) => (
            <li key={i}>{s}</li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default PasswordStrengthMeter;
