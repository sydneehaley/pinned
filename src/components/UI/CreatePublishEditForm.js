import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import _ from 'lodash';
import DotLoader from 'react-spinners/DotLoader';
import AddIcon from './Icons/AddIcon';
import { useAuthState } from '../../firebase/config';
import { css } from '@emotion/react';
import Button from './Button';

export default function CreatePublishEditForm({
  formTitle,
  children,
  onFileChange,
  inputOnChange,
  handleOnSubmit,
  pinImg,
  error,
  submitText,
  title,
  description,
  alt_tag,
  target,
  preview,
  label,
  loader,
  boards,
}) {
  const { user, users } = useAuthState();
  const [errorMsg, setErrorMsg] = useState('');
  const [showLabel, setShowLabel] = useState(true);
  const [toggleAlt, setToggleAlt] = useState(false);
  const [loading, setLoading] = useState(true);

  let [color, setColor] = useState('#767676');

  const override = css`
    display: block;
    margin: 0 auto;
    border-color: red;
  `;

  useEffect(() => {}, []);

  const toggleField = () => {
    setToggleAlt(true);
  };

  return (
    <div class='w-full h-[100vh] flex justify-center bg-neutral-200'>
      <div class='flex flex-form_side w-full'></div>
      <div class='w-full h-[75vh] flex flex-col flex-form_middle basis-[17%] mt-[4rem] justify-center'>
        {/* Middle Container */}
        <div class='flex items-center justify-start w-full mb-[1rem]'>
          <h1 class='font-bold text-2xl'>{formTitle}</h1>
        </div>
        {/* Form Container  */}
        <div class='bg-white flex w-full h-full items-center justify-center rounded-lg p-[3rem] '>
          <div class='flex w-full h-full justify-between gap-x-5'>
            <div class={`flex ${pinImg === '' ? 'bg-neutral-200' : null}  flex-1 rounded-md`}>
              <div class={`w-full  flex items-center justify-center ${pinImg === '' ? 'p-[1rem]' : null}`}>
                <div class={`w-full h-full flex justify-center ${pinImg === '' ? ' border-2 border-dashed' : null} border-neutral-400`}>
                  <input hidden id='uploadImg' type='file' accept='image/*' onChange={onFileChange} />
                  {label && (
                    <label for='uploadImg' class='w-full flex flex-col items-center justify-center'>
                      <div class='bg-red rounded-full w-10 h-10 flex items-center justify-center'>
                        {' '}
                        <AddIcon fill={'white'} classes={'w-6 h-6'} />
                      </div>
                    </label>
                  )}

                  {preview && (
                    <div>
                      {pinImg === '' ? (
                        <div class='flex h-full items-center justify-center'>
                          <DotLoader color={color} loading={loading} css={override} size={60} />
                        </div>
                      ) : (
                        <div class='h-full w-full'>
                          <img class='h-full w-full object-cover  rounded-md' src={pinImg} alt='pin_image' />
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right Side Content */}

            <div class='flex flex-col flex-1  items-end w-full pb-[1rem]'>
              <div class='flex w-full justify-end items-center'>
                <div class='h-[40px] pt-[3rem] pb-[4rem] flex items-center justify-center min-w-[12rem]'>
                  <div>{children}</div>
                  <div>
                    <button
                      type='submit'
                      onClick={handleOnSubmit}
                      class='bg-red text-white rounded-br-lg rounded-tr-lg h-[40px] font-bold  px-[14px]'
                    >
                      {submitText}
                    </button>
                  </div>
                </div>
              </div>

              {/* Validation Error Message */}
              {errorMsg && (
                <div>
                  <p>{errorMsg}</p>
                </div>
              )}

              {/* Form inputs */}
              <div class='flex  flex-col  w-[90%] justify-between'>
                <div class=' flex flex-col items-start p-0 '>
                  <input
                    class={`${
                      title === ''
                        ? 'border-b border-solid border-neutral-400 border-t-0 border-l-0 border-r-0 focus:ring-0  focus:border-blue-500'
                        : 'border-b-0 border-t-0 border-l-0 border-r-0 border-solid focus:ring-0  focus:border-blue-500'
                    } w-full m-0  pl-0  text-[36px] font-bold text-black placeholder:text-neutral-600  focus:border-b-2`}
                    type='text'
                    placeholder={`Title`}
                    name='title'
                    value={title}
                    onChange={inputOnChange}
                  ></input>
                  <div class='flex items-center pt-[2rem] pb-[1rem]'>
                    <img class='w-[50px] h-[50px] rounded-full  p-[2px]' src={user?.photoURL} />

                    <h6 class='ml-3 font-bold ml-[5px] mb-0 mr-0 mt-0'>{users?.filter((usr) => usr.uid === user?.uid)[0]?.name}</h6>
                  </div>
                </div>

                <div class='w-full flex flex-col justify-end'>
                  <div class='w-full py-[2rem]'>
                    <input
                      class='flex font-medium w-full focus:ring-0 focus:border-blue-500 focus:border-b-2 border-neutral-400 border-b-1 border-t-0 border-l-0 border-r-0 border-solid pl-0 pr-0 py-[0.5rem] placeholder:text-neutral-500 placeholder:font-normal placeholder:text-[1rem]'
                      placeholder='Tell everyone what your Pin is about'
                      type='text'
                      name='description'
                      value={description}
                      onChange={inputOnChange}
                    />
                  </div>

                  <div class='pt-0 pb-[5rem]'>
                    {toggleAlt === false ? (
                      <div>
                        <Button
                          background={'bg-neutral-200'}
                          onClickAction={toggleField}
                          classes={'py-[12px] px-[1rem] min-h-[48px] min-w-[60px] outline-0 hover:bg-black hover:text-white'}
                        >
                          Add alt tag
                        </Button>
                      </div>
                    ) : (
                      <div class='w-full'>
                        <input
                          class='flex font-medium w-full focus:ring-0 focus:border-blue-500 focus:border-b-2 border-neutral-400 border-b-1 border-t-0 border-l-0 border-r-0 border-solid pl-0 pr-0 py-[0.5rem] placeholder:text-neutral-500 placeholder:font-normal placeholder:text-[1rem]'
                          name='alt_tag'
                          placeholder='Alt tag'
                          type='text'
                          value={alt_tag}
                          onChange={inputOnChange}
                        />
                      </div>
                    )}
                  </div>
                  <div class='w-full flex items-center'>
                    <input
                      class='flex font-bold text-[18px] w-full h-full focus:ring-0 focus:border-blue-500 border-neutral-400 border-b-1 border-t-0 border-l-0 border-r-0 border-solid pl-0 pr-0 py-[0.5rem] placeholder:text-neutral-500 placeholder:font-normal placeholder:text-[18px]'
                      name='target'
                      placeholder='Add a destination link'
                      type='text'
                      value={target}
                      onChange={inputOnChange}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class='flex flex-form_side w-full items-center justify-center'></div>
    </div>
  );
}
