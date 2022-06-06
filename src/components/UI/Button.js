const Button = ({ background, children, classes, color, hover, onClickAction, type }) => {
  return (
    <button
      class={`${background}  tracking-normal rounded-full font-bold cursor-pointer ${classes} ${hover} ${color} `}
      onClick={onClickAction}
      type={type}
    >
      {children}
    </button>
  );
};

export default Button;
