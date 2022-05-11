import React, { useEffect } from 'react';
import { useSearchParams, createSearchParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useAuthState } from '../firebase/config';

const SearchResults = () => {
  const query = useSelector((state) => state.pingallery.searchParams);
  const { pins } = useAuthState();

  const [searchParams, setSearchParams] = useSearchParams();

  const mySearch = searchParams.get('content');

  useEffect(() => {
    setSearchParams(createSearchParams({ content: query }));
  }, []);

  console.log(query);
  return (
    <div className='home'>
      <div
        style={{
          display: ' flex',
          flexDirection: 'column',
          justifyContent: 'center',
          width: '90%',
        }}
      >
        <h1 style={{ fontSize: '3rem' }}>"{query}"</h1>
        {pins
          .filter((val) => {
            if (query == '') {
              return null;
            } else if (val?.title?.toLowerCase().includes(query)) {
              return val;
            }
          })
          .map((val, key) => {
            return (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  flexDirection: 'column',
                }}
              >
                <img
                  style={{
                    width: '250px',
                    borderRadius: '16px',
                  }}
                  src={val.img_url}
                />
                <h3 style={{ margin: '0 0 0 1rem' }}>{val.title}</h3>
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default SearchResults;
