import { useState, useRef } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { useAuthState } from '../../firebase/config';
import Modal from './Modal';
import SaveToBoard from './SaveToBoard';
import HeartOutlineIcon from './Icons/HeartOutlineIcon';
import AddIcon from './Icons/AddIcon';

const Pin = ({ index, pin }) => {
  let location = useLocation();
  const [hover, setHover] = useState(false);
  const { users, pins } = useAuthState();
  const [toggleModal, setToggleModal] = useState(false);
  const [getSpans, setGetSpans] = useState(1);
  const imageRef = useRef();
  const pinContainer = useRef();

  const handleImageHover = () => {
    setHover(true);
  };

  const openModal = () => {
    setToggleModal(true);
  };

  const closeModal = () => [setToggleModal(false)];

  var arr = [];

  var dividingVal = 3;

  var calculation = Math.floor(pins.length / dividingVal);

  for (let i = 0; i < pins.length; i = i + calculation) {
    arr.push(i);
  }

  let isInArray = arr.includes(index);

  return (
    <div
      ref={pinContainer}
      class='relative w-full mb-[10px] max-h-full break-inside-avoid'
      onMouseOver={handleImageHover}
      onMouseLeave={() => setHover(false)}
    >
      <div class='relative'>
        {hover && (
          <div>
            <div class='absolute z-20 w-[4.5rem] flex h-[2rem] left-[61%] h-[4rem]  px-[15px]'>
              {/* <div class='flex items-end  py-[1rem]'>
                <div class='flex items-center'>
                  <img class='w-[30px] h-[30px] rounded-full' src={users?.filter((user) => user.uid === props?.pin.author)[0].photoURL} />
                  <span class='text-white font-medium text-[14px] pl-[5px]'>{users?.filter((user) => user.uid === props?.pin.author)[0].name}</span>
                </div>{' '}
              </div> */}
              {/* </Link> */}
              <div class='flex  py-[1rem] z-20 pr-[1rem]'>
                <button onClick={openModal} class='bg-white opacity-80 rounded-sm flex items-center justify-center h-[32px] px-[11px] mr-[5px]'>
                  <HeartOutlineIcon stroke={'#767676'} classes={'w-[18px] h-[18px]'} />
                </button>
                <button onClick={openModal} class='bg-white opacity-80 rounded-sm flex items-center justify-center h-[32px] px-[11px]'>
                  <AddIcon fill={'#767676'} classes={'w-[18px] h-[18px]'} />
                </button>
              </div>
            </div>
            <Link to={`view/pin/${pin.id}`} style={{ cursor: 'zoom-in' }} state={{ background: location }}>
              <div class='absolute z-10 bg-gray-900/50 rounded-md  inset-0 inline-block'></div>
            </Link>
          </div>
        )}

        <div class='relative '>
          <img
            ref={imageRef}
            src={pin?.img_url}
            alt='pin'
            class={`max-h-full object-cover object-center box-content max-w-full rounded-md ${isInArray === true && 'h-[600px]'}`}
          />
        </div>
      </div>

      <div>
        <Modal isOpen={toggleModal} closeModal={closeModal} openModal={openModal} title={'Save To Board'}>
          <SaveToBoard id={pin.id} />
        </Modal>
      </div>
    </div>
  );
};

export default Pin;
