import Pin from './Pin';

const PinList = ({ pins }) => {
  const images = pins?.map((pin, i) => {
    return <Pin key={i} pin={pin} index={i} />;
  });

  return <div class='columns-5 gap-[10px] inline-block '>{images}</div>;
};

export default PinList;
