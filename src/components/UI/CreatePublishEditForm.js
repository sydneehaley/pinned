import React, { useState, useEffect, useRef, Fragment } from 'react';
import { useLocation } from 'react-router-dom';
import _ from 'lodash';
import { Listbox, Transition, Switch } from '@headlessui/react';
import DotLoader from 'react-spinners/DotLoader';
import BoardsMenu from './BoardsMenu';
import AddIcon from './Icons/AddIcon';
import ArrowLeft from './Icons/ArrowLeft';
import ArrowRight from './Icons/ArrowRight';
import { db, useAuthState } from '../../firebase/config';
import { css } from '@emotion/react';
import ChevronDownIcon from './Icons/ChevronDownIcon';
import { CheckIcon, SelectorIcon } from '@heroicons/react/solid';
import SearchIcon from './Icons/SearchIcon';
import Button from './Button';
import { doc, updateDoc, onSnapshot } from 'firebase/firestore';

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
  const location = useLocation();
  const { user } = useAuthState();
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

  const uploadPinPath = 'create/upload/pin';

  const toggleField = () => {
    setToggleAlt(true);
  };

  return (
    <div class='w-full h-full flex  items-center justify-center bg-lightest_gray'>
      <div class='flex flex-form_side  w-full items-center justify-center'></div>
      <div class='w-full h-[75vh] flex flex-col flex-form_middle basis-[17%] items-center justify-center'>
        {/* Middle Container */}
        <div class='flex items-center justify-start w-full mb-[1rem]'>
          <h1 class='font-bold text-2xl'>{formTitle}</h1>
        </div>
        {/* Form Container  */}
        <div class='bg-white flex w-full h-full items-center justify-center rounded-lg p-[3rem] '>
          <div class='flex w-full h-full justify-between gap-x-5'>
            <div class={`flex ${pinImg === '' ? 'bg-lightest_gray' : null}  flex-1 rounded-md`}>
              <div class={`w-full  flex items-center justify-center ${pinImg === '' ? 'p-[1rem]' : null}`}>
                <div class={`w-full h-full flex justify-center ${pinImg === '' ? ' border-2 border-dashed' : null} border-gray-300`}>
                  <input hidden id='uploadImg' type='file' accept='image/*' onChange={onFileChange} />
                  {label && (
                    <label for='uploadImg' class='w-full flex flex-col items-center justify-center'>
                      <div class='bg-red rounded-full w-10 h-10 flex items-center justify-center'>
                        {' '}
                        <AddIcon stroke={'white'} classes={' w-8 h-8'} />
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
                  <div>{children}</div>{' '}
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
                        ? 'border-b border-solid border-placeholders border-t-0 border-l-0 border-r-0 focus:ring-0  focus:border-blue-500'
                        : 'border-b-0 border-t-0 border-l-0 border-r-0 border-solid focus:ring-0  focus:border-blue-500'
                    } w-full m-0  pl-0  text-[36px] font-bold text-black placeholder:text-placeholders  focus:border-b-2`}
                    type='text'
                    placeholder={`Title`}
                    name='title'
                    value={title}
                    onChange={inputOnChange}
                  ></input>
                  <div class='flex items-center pt-[2rem] pb-[1rem]'>
                    <img class='w-[50px] h-[50px] rounded-full border-2 p-[3px] border-solid border-input_gray' src={user?.photoURL} />

                    <h6 class='ml-3 font-bold ml-[5px] mb-0 mr-0 mt-0'>{user?.displayName}</h6>
                  </div>
                </div>

                <div class='w-full flex flex-col justify-end'>
                  <div class='w-full py-[2rem]'>
                    <input
                      class='flex font-medium w-full focus:ring-0 focus:border-blue-500 focus:border-b-2 border-placeholders border-b-1 border-t-0 border-l-0 border-r-0 border-solid pl-0 pr-0 py-[0.5rem] placeholder:text-light_placeholders placeholder:font-normal placeholder:text-[1rem]'
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
                        <Button background={'bg-lightest_gray'} onClickAction={toggleField}>
                          Add alt tag
                        </Button>
                      </div>
                    ) : (
                      <div class='w-full'>
                        <input
                          class='flex font-medium w-full focus:ring-0 focus:border-blue-500 focus:border-b-2 border-placeholders border-b-1 border-t-0 border-l-0 border-r-0 border-solid pl-0 pr-0 py-[0.5rem] placeholder:text-light_placeholders placeholder:font-normal placeholder:text-[1rem]'
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
                      class='flex font-bold text-[18px] w-full h-full focus:ring-0 focus:border-blue-500 border-placeholders border-b-1 border-t-0 border-l-0 border-r-0 border-solid pl-0 pr-0 py-[0.5rem] placeholder:text-placeholders placeholder:font-normal placeholder:text-[18px]'
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
      <div class='flex flex-form_side w-full items-center justify-center'>{/* <ArrowRight stroke={'black'} classes={'w-6 h-6'} /> */}</div>
    </div>
  );
}
