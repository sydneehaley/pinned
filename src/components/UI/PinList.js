import React from 'react';
import Pin from './Pin';

const PinList = ({ pins_data }) => {
  const images = pins_data?.map((pin, i) => {
    return <Pin key={pin?.id} pin={pin} index={i} />;
  });

  return <div class='columns-5 gap-[10px] inline-block '>{images}</div>;
};

export default PinList;
