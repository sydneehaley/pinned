const ChevronDownIcon = ({ fill, stroke, classes }) => {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      class={classes}
      fill={fill}
      viewBox='0 0 24 24'
      stroke={stroke}
      stroke-width='3'
    >
      <path
        stroke-linecap='round'
        stroke-linejoin='round'
        d='M19 9l-7 7-7-7'
      />
    </svg>
  );
};

export default ChevronDownIcon;
