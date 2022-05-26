import React from 'react';
import '../App.css';
import story5202022_1 from './Images/story5202022_1.jpg';
import story5202022_2 from './Images/story5202022_2.jpg';
import story5202022_3 from './Images/story5202022_3.jpg';
import story5202022_4 from './Images/story5202022_4.jpg';
import story5202022_5 from './Images/story5202022_5.jpg';

const Stories = () => {
  return (
    <div class='w-full flex items-center justify-center'>
      <div class='w-[97%] grid gap-[10px] mb-[10rem] overflow-scroll'>
        <div
          style={{
            backgroundImage: `linear-gradient(360deg, rgba(0, 0, 0, 1) 0%, rgba(0, 0, 0, 0) 100%), url(${story5202022_1})`,
            backgroundPosition: 'center',
            backgroundSize: 'cover',
          }}
          class='h-[50vh] rounded-xl grid grid-cols-1'
        >
          <header class='mt-[32vh] flex flex-col items-center justify-center leading-10'>
            <h2 class='text-white font-[400] text-center'>Lifestyle</h2>
            <h1 class='font-bold text-white text-[1.7rem] text-center text-[14px]'>Top lifestyle trends of summer 2022</h1>
          </header>
        </div>

        <div class='w-full grid grid-cols-2 gap-[10px]'>
          <div
            style={{
              backgroundImage: `linear-gradient(360deg, rgba(0, 0, 0, 1) 0%, rgba(0, 0, 0, 0) 100%), url(${story5202022_2})`,
              backgroundPosition: 'center',
              backgroundSize: 'cover',
            }}
            class='h-[50vh] rounded-xl flex items-center justify-center col-span-1'
          >
            <header class='mt-[30vh] flex flex-col items-center justify-center leading-8 w-[20rem]'>
              <h2 class='text-white font-[400] text-center text-[14px]'>Home</h2>
              <h1 class='font-bold text-white text-[1.7rem] text-center'>How to maintain and grow your houseplants</h1>
            </header>
          </div>

          <div
            style={{
              backgroundImage: `linear-gradient(360deg, rgba(0, 0, 0, 1) 0%, rgba(0, 0, 0, 0) 100%), url(${story5202022_3})`,
              backgroundPosition: 'center',
              backgroundSize: 'cover',
            }}
            class='col-span-1 h-[50vh] rounded-xl flex items-center justify-center'
          >
            <header class='mt-[30vh] flex flex-col items-center justify-center leading-8 w-[20rem]'>
              <h2 class='text-white font-[400] text-center text-[14px]'>Decor</h2>
              <h1 class='font-bold text-white text-[1.7rem] text-center'>Floral decor ideas for your home and office</h1>
            </header>
          </div>
        </div>

        <div class='w-full grid grid-cols-2 gap-[10px]'>
          <div
            style={{
              backgroundImage: `linear-gradient(360deg, rgba(0, 0, 0, 1) 0%, rgba(0, 0, 0, 0) 100%), url(${story5202022_4})`,
              backgroundPosition: 'center',
              backgroundSize: 'cover',
            }}
            class='h-[50vh] rounded-xl flex items-center justify-center col-span-1'
          >
            <header class='mt-[30vh] flex flex-col items-center justify-center leading-8 w-[20rem]'>
              <h2 class='text-white font-[400] text-center text-[14px]'>Beauty</h2>
              <h1 class='font-bold text-white text-[1.7rem] text-center'>Quick and easy makeup tips for everyday looks </h1>
            </header>
          </div>

          <div
            style={{
              backgroundImage: `linear-gradient(360deg, rgba(0, 0, 0, 1) 0%, rgba(0, 0, 0, 0) 100%), url(${story5202022_5})`,
              backgroundPosition: 'center',
              backgroundSize: 'cover',
            }}
            class='col-span-1 h-[50vh] rounded-xl flex items-center justify-center'
          >
            <header class='mt-[30vh] flex flex-col items-center justify-center leading-8 w-[20rem]'>
              <h2 class='text-white font-[400] text-center text-[14px]'>Style</h2>
              <h1 class='font-bold text-white text-[1.7rem] text-center'>Floral decor ideas for your home and office</h1>
            </header>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Stories;
