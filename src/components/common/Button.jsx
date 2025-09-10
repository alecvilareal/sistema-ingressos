const Button = ({ children, onClick, type = 'button', ...props }) => {
  return (
    <button
      type={type}
      onClick={onClick}
      style={{ padding: '10px 15px', margin: '5px 0', width: '100%', borderRadius: '5px', border: 'none', background: '#007bff', color: 'white', cursor: 'pointer' }}
      {...props}
    >
      {children}
    </button>
  );
};
export default Button;