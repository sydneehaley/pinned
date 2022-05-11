import { useSelector } from 'react-redux';
import { useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import React, { useState } from 'react';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { doc, onSnapshot } from 'firebase/firestore';
import { db, useAuthState } from '../firebase/config';
import _ from 'lodash';

const PinView = () => {
  const { user, pins } = useAuthState();
  const { id } = useParams();

  console.log(pins);

  return (
    <div class='w-full  bg-lightest_gray flex  justify-center'>
      {pins
        ?.filter((pin, i) => pin.id === id)
        .map((pin, i) => (
          <div class='w-full flex '>
            <div class='w-[60%] flex items-center justify-center'>
              <div class='w-[70%]'>
                <img class='rounded-2xl' src={pin.img_url} />
              </div>
            </div>
            <div class='bg-white flex w-[40%]  items-center justify-start'>
              <div class='pl-[4rem]'>
                <h1 class='text-[3rem] font-bold'>{pin.title}</h1>
                <p>{pin.description}</p>
              </div>
            </div>
          </div>
        ))}
    </div>
  );
};
export default PinView;
