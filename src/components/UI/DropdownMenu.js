import React, { Fragment, useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Menu, Popover, Transition, Combobox, Dialog } from '@headlessui/react';
import ChevronDownIcon from './Icons/ChevronDownIcon';

export default function DropDownMenu({
  one,
  two,
  three,
  four,
  five,
  button,
  buttonClasses,
  menuClasses,
  linkOne,
  linkTwo,
  linkThree,
  linkFour,
  linkFive,
  onClickOne,
  onClickTwo,
  onClickFive,
}) {
  return (
    <div class='m-0'>
      <Menu as='div' className='m-0'>
        <Menu.Button className={buttonClasses}>
          {/* <ChevronDownIcon
            stroke={'black'}
            fill={'none'}
            classes={'h-5 w-5 hover:text-red'}
            className='w-5 h-5  text-black hover:text-red'
            aria-hidden='true'
          /> */}
          {button}
        </Menu.Button>

        <Transition
          as={Fragment}
          enter='transition ease-out duration-100'
          enterFrom='transform opacity-0 scale-95'
          enterTo='transform opacity-100 scale-100'
          leave='transition ease-in duration-75'
          leaveFrom='transform opacity-100 scale-100'
          leaveTo='transform opacity-0 scale-95'
        >
          <Menu.Items className={menuClasses}>
            <div className='px-1 py-1 '>
              {one != null && (
                <div>
                  {linkOne === null ? (
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          className={`${active ? 'bg-black text-white' : 'text-black'} group flex rounded-md items-center w-full px-2 py-2 text-sm `}
                          onClick={onClickOne}
                        >
                          <p class=' font-bold'>{one}</p>
                        </button>
                      )}
                    </Menu.Item>
                  ) : (
                    <Menu.Item>
                      {({ active }) => (
                        <Link to={linkOne}>
                          <button
                            className={`${
                              active ? 'bg-black text-white' : 'text-black'
                            } group flex rounded-md items-center w-full px-2 py-2 text-sm `}
                          >
                            <p class=' font-bold'>{one}</p>
                          </button>
                        </Link>
                      )}
                    </Menu.Item>
                  )}
                </div>
              )}

              {two != null && (
                <div>
                  {linkTwo === null ? (
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          className={`${
                            active ? 'bg-black text-white' : 'text-gray-900'
                          } group flex rounded-md items-center w-full px-2 py-2 text-sm`}
                          onClick={onClickTwo}
                        >
                          {/* {active ? <HelpIcon className='w-5 h-5 mr-2' aria-hidden='true' /> : <HelpIcon className='w-5 h-5 mr-2' aria-hidden='true' />} */}{' '}
                          <p class=' font-bold'>{two}</p>
                        </button>
                      )}
                    </Menu.Item>
                  ) : (
                    <Menu.Item>
                      {({ active }) => (
                        <Link to={linkTwo}>
                          <button
                            className={`${
                              active ? 'bg-black text-white' : 'text-black'
                            } group flex rounded-md items-center w-full px-2 py-2 text-sm `}
                          >
                            <p class=' font-bold'>{two}</p>
                          </button>
                        </Link>
                      )}
                    </Menu.Item>
                  )}
                </div>
              )}
            </div>

            <div className={three != null ? 'px-1 py-1' : null}>
              {three != null && (
                <div>
                  {linkThree === null ? (
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          className={`${
                            active ? 'bg-black text-white' : 'text-gray-900'
                          } group flex rounded-md items-center w-full px-2 py-2 text-sm`}
                        >
                          <p class=' font-bold'>{three}</p>
                        </button>
                      )}
                    </Menu.Item>
                  ) : (
                    <Menu.Item>
                      {({ active }) => (
                        <Link to={linkThree}>
                          <button
                            className={`${
                              active ? 'bg-black text-white' : 'text-black'
                            } group flex rounded-md items-center w-full px-2 py-2 text-sm `}
                          >
                            <p class=' font-bold'>{three}</p>
                          </button>
                        </Link>
                      )}
                    </Menu.Item>
                  )}
                </div>
              )}

              {four != null && (
                <div>
                  {linkFour === null ? (
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          className={`${
                            active ? 'bg-black text-white' : 'text-gray-900'
                          } group flex rounded-md items-center w-full px-2 py-2 text-sm`}
                        >
                          <p class=' font-bold'>{four}</p>
                        </button>
                      )}
                    </Menu.Item>
                  ) : (
                    <Menu.Item>
                      {({ active }) => (
                        <Link to={linkFour}>
                          <button
                            className={`${
                              active ? 'bg-black text-white' : 'text-black'
                            } group flex rounded-md items-center w-full px-2 py-2 text-sm `}
                          >
                            <p class=' font-bold'>{four}</p>
                          </button>
                        </Link>
                      )}
                    </Menu.Item>
                  )}
                </div>
              )}
            </div>

            {five != null && (
              <div className='px-1 py-1'>
                <div>
                  {linkFive === null ? (
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          className={`${
                            active ? 'bg-black text-white' : 'text-gray-900'
                          } group flex rounded-md items-center w-full px-2 py-2 text-sm`}
                          onClick={onClickFive}
                        >
                          <p class='font-bold'>{five}</p>
                        </button>
                      )}
                    </Menu.Item>
                  ) : (
                    <Menu.Item>
                      {({ active }) => (
                        <Link to={linkFive}>
                          <button
                            className={`${
                              active ? 'bg-black text-white' : 'text-black'
                            } group flex rounded-md items-center w-full px-2 py-2 text-sm `}
                          >
                            <p class=' font-bold'>{five}</p>
                          </button>
                        </Link>
                      )}
                    </Menu.Item>
                  )}
                </div>
              </div>
            )}
          </Menu.Items>
        </Transition>
      </Menu>
    </div>
  );
}
