const Button = ({ background, children, classes, color, hover, onClickAction }) => {
  return (
    <button class={`${background}  tracking-normal rounded-full font-bold cursor-pointer ${classes} ${hover} ${color} `} onClick={onClickAction}>
      {children}
    </button>
  );
};

export default Button;
