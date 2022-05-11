const SaveIcon = ({ classes, fill, stroke }) => {
  return (
    <svg xmlns='http://www.w3.org/2000/svg' class={classes} fill={fill} viewBox='0 0 24 24' stroke={stroke} stroke-width='2'>
      <path
        stroke-linecap='round'
        stroke-linejoin='round'
        d='M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4'
      />
    </svg>
  );
};

export default SaveIcon;
