// Dependencies

// Styles
import './button.scss';

type ButtonProps = {
  children: React.ReactNode | null;
  className: string;
  disabled: boolean;
  onClick?: () => void;
};

const buttonProps: ButtonProps = {
  children: null,
  className: '',
  disabled: false,
  onClick: undefined,
};

const Button = ({ className, children, disabled, onClick }: ButtonProps): JSX.Element => {
  return (
    <button
      onClick={() => {
        onClick ? onClick() : null;
      }}
      className={`button ${className} ${disabled && ''}`}
    >
      <p className={`button__text`}>{children}</p>
    </button>
  );
};

Button.defaultProps = buttonProps;

export default Button;
