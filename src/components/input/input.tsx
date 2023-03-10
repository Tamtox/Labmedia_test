import '@/components/input/input.scss';

type InputProps = {
  children: React.ReactNode | null;
  className?: string;
  classNameWrapper?: string;
  defaultValue?: string;
  disabled?: boolean;
  onChange?: (newValue: string) => void;
  placeholder?: string;
  required?: boolean;
  type?: string;
  value?: string;
};

const inputProps: InputProps = {
  children: null,
  className: '',
  classNameWrapper: '',
  defaultValue: '',
  disabled: false,
  onChange: undefined,
  placeholder: '',
  required: false,
  type: 'text',
  value: '',
};
const Input = ({
  value,
  defaultValue,
  placeholder,
  type,
  className,
  classNameWrapper,
  children,
  disabled,
  required,
  onChange,
}: InputProps): JSX.Element => {
  return (
    <div className={`input-container ${classNameWrapper}`}>
      {children}
      <input
        placeholder={placeholder && placeholder}
        value={value && value}
        type={type ? type : 'text'}
        required={required || false}
        onChange={(e: any) => {
          onChange ? onChange(e.target.value) : null;
        }}
        className={`input ${className}`}
      ></input>
    </div>
  );
};

Input.defaultProps = inputProps;

export default Input;
