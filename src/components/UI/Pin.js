import { useState, useRef } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { useAuthState } from '../../firebase/config';
import Modal from './Modal';
import SaveToBoard from './SaveToBoard';
import HeartOutlineIcon from './Icons/HeartOutlineIcon';
import AddIcon from './Icons/AddIcon';

const Pin = ({ index, pin }) => {
  const { pins } = useAuthState;
  let location = useLocation();
  const [hover, setHover] = useState(false);
  const { users } = useAuthState();
  const [toggleModal, setToggleModal] = useState(false);
  const [getSpans, setGetSpans] = useState(1);
  const imageRef = useRef();
  const pinContainer = useRef();

  // These functions handle the state which toggles pin view modal.

  const handleImageHover = () => {
    setHover(true);
  };

  const openModal = () => {
    setToggleModal(true);
  };

  const closeModal = () => {
    setToggleModal(false);
  };

  /* 

  This logic creates an array (for loop) with indexes from the pins array that changes the height
  of certain pins in the grid/gallery.

  */

  var arr = [];

  var dividingVal = 3;

  var calculation = Math.floor(pins?.length / dividingVal);

  for (let i = 0; i < pins?.length; i = i + calculation) {
    arr.push(i);
  }

  // If pin's index is included in the array the pin's height is changed.

  let isInArray = arr.includes(index);

  /* 
  
  A div is returned with pin and author/title below it. Hover state is also 
  implemented for each pen which allows user to save pin to one of their boards.
  
  */

  return (
    <div
      ref={pinContainer}
      class='relative w-full mb-[25px] max-h-full break-inside-avoid'
      onMouseOver={handleImageHover}
      onMouseLeave={() => setHover(false)}
    >
      <div class='relative'>
        {hover && (
          <div>
            <div class='absolute z-20 w-[4.5rem] flex h-[2rem] left-[80%] h-[4rem]  px-[15px]'>
              <div class='flex flex-col py-[1rem] z-20 pr-[1rem]'>
                <button onClick={openModal} class='bg-gray-900/50 rounded-full p-[0.5rem]'>
                  {' '}
                  <AddIcon fill={'white'} classes={'w-4 h-4'} />
                </button>
              </div>
            </div>
            <Link to={`view/pin/${pin.id}`} style={{ cursor: 'zoom-in' }} state={{ background: location }}>
              <div
                style={{ height: `${imageRef.current.height + 'px'}` }}
                class={`absolute z-10 bg-gray-900/50 rounded-xl inset-0 inline-block`}
              ></div>
            </Link>
          </div>
        )}

        <div class='relative'>
          <img
            ref={imageRef}
            src={pin?.img_url}
            alt='pin'
            class={`max-h-full object-cover object-center box-content max-w-full rounded-xl ${isInArray === true && 'h-[500px]'}`}
          />

          <div class='flex mt-[25px]'>
            <div class='w-full flex items-center'>
              <div class='flex  items-center w-[75%]'>
                <img class='w-[20px] h-[20px] rounded-full' src={users?.filter((usr) => usr.uid === pin?.author)[0].photoURL} />
                <p class='font-[700] text-[14px] ml-[7px] tracking-normal'>{pin?.title}</p>
              </div>
            </div>
          </div>
        </div>

        <Modal isOpen={toggleModal} closeModal={closeModal} openModal={openModal} title={'Save To Board'}>
          <SaveToBoard id={pin.id} />
        </Modal>
      </div>
    </div>
  );
};

export default Pin;
