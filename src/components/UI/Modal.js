import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Modal({ children, closeModal, isOpen, openModal, title, classes, modalClass, modalHeight }) {
  return (
    <>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as='div' className='fixed inset-0 z-40 overflow-y-auto' onClose={closeModal}>
          <div className='min-h-screen px-4 text-center'>
            <Transition.Child
              as={Fragment}
              enter='ease-out duration-300'
              enterFrom='opacity-0'
              enterTo='opacity-100'
              leave='ease-in duration-200'
              leaveFrom='opacity-100'
              leaveTo='opacity-0'
            >
              <Dialog.Overlay className='fixed inset-0 bg-gray-900/50' />
            </Transition.Child>

            <span className='inline-block h-screen align-middle' aria-hidden='true'>
              &#8203;
            </span>
            <Transition.Child
              as={Fragment}
              enter='ease-out duration-300'
              enterFrom='opacity-0 scale-95'
              enterTo='opacity-100 scale-100'
              leave='ease-in duration-200'
              leaveFrom='opacity-100 scale-100'
              leaveTo='opacity-0 scale-95'
            >
              <div
                className={`inline-block ${modalHeight} relative  w-full max-w-md   overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl`}
              >
                <div class='w-full  flex items-center justify-center '>
                  <div class='flex flex-col w-[90%] '>
                    <div class='w-full h-[8vh] m-0 flex items-center justify-center'>
                      <Dialog.Title as='h3' className='text-[1.5rem] font-bold leading-6 text-gray-900 w-full flex items-center justify-center '>
                        {title}
                      </Dialog.Title>
                    </div>
                    <div class='w-full h-[57vh]'>{children}</div>
                  </div>
                </div>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}
