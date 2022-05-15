import React, { useEffect, useState } from 'react';
import { useSearchParams, createSearchParams, Link, useLocation, generatePath, URLSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useAuthState } from '../firebase/config';
import { getBackground } from '../store/features/appState';

const SearchResults = () => {
  const location = useLocation();
  console.log(location);
  const urlQ = location.search.replace('?content=', '');
  // const backgroundUrlQ = location.state.background?.search?.replace('?content=', '');
  // const getQuery = useSelector((state) => state.pingallery.searchParams);
  console.log(urlQ);
  const { pins, users, currSearch } = useAuthState();
  const storedSearch = currSearch;
  console.log(storedSearch);
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('content');
  console.log(query);
  useEffect(() => {
    if (query == null) {
      createSearchParams({ content: storedSearch });
    }
  }, []);

  let filteredContent = pins;

  if (query || storedSearch || urlQ !== '') {
    filteredContent = pins.filter((val) => {
      return val?.title?.toLowerCase().includes(storedSearch);
    });
  }

  return (
    <div className='w-full home flex flex-col items-center'>
      <div class='w-[90%] justify-center'>
        <h1 class='text-[3rem] mb-[1rem] font-bold'>{storedSearch}</h1>

        {filteredContent.length !== 0 ? (
          <div class='columns-5 '>
            {filteredContent.map((val, i) => {
              return (
                <div class='mb-[25px] break-inside-avoid'>
                  <Link to={`/search/view/pin/${val?.id}`} style={{ cursor: 'zoom-in' }} state={{ background: location }}>
                    <img class='object-cover rounded-lg' src={val.img_url} />
                    <div class='flex mt-[1rem] items-center w-[75%]'>
                      <img class='w-[20px] h-[20px] rounded-full' src={users?.filter((usr) => usr.uid === val.author)[0].photoURL} />
                      <p class='font-[700] text-[14px] ml-[7px] tracking-normal'>{val?.title}</p>
                    </div>
                  </Link>
                </div>
              );
            })}
          </div>
        ) : (
          <div>
            <h3>
              No matches found for "<b>{storedSearch}</b>"
            </h3>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchResults;
