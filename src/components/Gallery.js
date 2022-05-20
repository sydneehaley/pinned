import React, { Fragment, useState, useEffect } from 'react';
import { useAuthState } from '../firebase/config';
import Marquee from 'react-fast-marquee';
import { css } from '@emotion/react';
import HashLoader from 'react-spinners/HashLoader';
import _ from 'lodash';
import PinList from './UI/PinList';

const PinBoard = () => {
  /*

All pin data, current user data, and current user's following is fetched from Context.
A new state hook is created to store pins data to be displayed.

*/

  const { pins, userFollowing, user, currSearch } = useAuthState();
  const [followingPins, setFollowingPins] = useState();

  // This logic combines the user's pins with the user's pins they follow

  useEffect(() => {
    const following_pins = userFollowing?.filter((usr) => usr.user).map((id) => id.user);
    following_pins?.push(user?.uid);
    setFollowingPins(following_pins);
  }, []);

  const filtered_pins = pins?.filter((item) => {
    return followingPins?.includes(item?.author);
  });

  return (
    <Fragment>
      {/* <TrendingTags /> */}
      {filtered_pins?.length === 0 ? (
        <div class='flex w-full items-center justify-center h-full'>
          <div class='flex w-[90%] items-center justify-center h-[89vh]'>
            <h1 class='font-bold text-[1.5rem]'>Add a pin to get started</h1>
          </div>
        </div>
      ) : (
        <Fragment>
          <PinList pins={filtered_pins} />
        </Fragment>
      )}
    </Fragment>
  );
};

/* 

This component handles the scrolling marquee that is displayed above the pin gallery. 
react-fast-marquee library is used 

*/

const TrendingTags = () => {
  const data = ['Fashion', 'Art', 'Design', 'Film', 'Photography', 'Makeup', 'Beauty', 'News', 'Nail Art', 'Spiritual'];
  return (
    <div class='flex w-full h-20 flex items-center '>
      <div class='flex w-[7rem] border-r-[1px] border-slate-200 items-center'>
        <div>
          <h2 class='font-[600] text-xl  pr-[10px]'>Trending</h2>
        </div>
      </div>

      <div class='w-[89%] pl-[10px]'>
        <Marquee>
          {data.map((tag, i) => (
            <div key={i} class='w-[10%] flex items-center justify-center'>
              <h3 class=' text-lg text-neutral-600 font-[600]'>{tag}</h3>
            </div>
          ))}
        </Marquee>
      </div>
    </div>
  );
};

// This component handles the loading image animation. react-spinners library is used.

const Loading = () => {
  const [loading, setLoading] = useState(true);
  let [color, setColor] = useState('#E53132');

  const override = css`
    display: block;
    margin: 0 auto;
    padding: 4rem 0 0 0;
    border-color: red;
  `;

  return (
    <Fragment>
      <div class='flex flex-col items-center'>
        <HashLoader color={color} loading={loading} css={override} size={50} />
        <h1 class='font-bold text-xl my-[1rem]'>Updating your feed</h1>
      </div>
    </Fragment>
  );
};

// This is the parent component which displays the gallery of pins.

const Gallery = () => {
  const [loading, setLoading] = useState(true);

  // This timeout display a loader animation that indicated new pins are loading.

  useEffect(() => {
    const isLoading = setTimeout(() => {
      setLoading({ loading: false });
    }, 2500);
  }, []);

  // If loading state is true, the loader animation is displayed, if not the gallery is displayed.

  return (
    <div class='w-full mb-[10rem] flex items-center justify-center'>
      <div class='w-[97%]'>{loading === true ? <Loading /> : <PinBoard />}</div>
    </div>
  );
};

export default Gallery;
