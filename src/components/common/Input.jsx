const Input = ({ type = 'text', placeholder, value, onChange, ...props }) => {
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      style={{ padding: '10px', margin: '5px 0', width: '100%', borderRadius: '5px', border: '1px solid #ccc' }}
      {...props}
    />
  );
};
export default Input;