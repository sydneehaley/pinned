import React, { Fragment, useState, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { doc, onSnapshot } from 'firebase/firestore';
import { db, useAuthState } from '../firebase/config';
import Modal from './UI/Modal';
import { toggleDeletePinModal } from '../store/features/appState';
import Marquee from 'react-fast-marquee';
import { css } from '@emotion/react';
import HashLoader from 'react-spinners/HashLoader';
import BoardsIcon from './UI/Icons/BoardsIcon';
import HeartOutlineIcon from './UI/Icons/HeartOutlineIcon';
import _ from 'lodash';
import ChevronDownIcon from './UI/Icons/ChevronDownIcon';
import PinView from './PinView';
import AddIcon from './UI/Icons/AddIcon';
import SaveToBoard from './UI/SaveToBoard';
import TrendingIcon from './UI/Icons/TrendingIcon';
import AddSolidIcon from './UI/Icons/AddSolidIcon';
import SendIcon from './UI/Icons/SendIcon';
import MoreIcon from './UI/Icons/MoreIcon';
const PinCard = (props) => {
  let location = useLocation();
  const [hover, setHover] = useState(false);
  const { users, pins, user } = useAuthState();
  const [toggleModal, setToggleModal] = useState(false);
  const [getSpans, setGetSpans] = useState(1);
  const imageRef = useRef();
  const pinContainer = useRef();

  useEffect(() => {
    if (imageRef != null) {
      console.log(`${imageRef.current.height + 'px'}`);
    }
  }, []);

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

  let isInArray = arr.includes(props.index);

  return (
    <div
      ref={pinContainer}
      class='relative w-full mb-[25px]  break-inside-avoid '
      onMouseOver={handleImageHover}
      onMouseLeave={() => setHover(false)}
    >
      <div class='relative'>
        {hover && (
          <div>
            <div class='absolute z-20 w-[4.5rem] flex h-[2rem] left-[80%] h-[4rem]  px-[15px]'>
              <div class='flex flex-col py-[1rem] z-20 pr-[1rem]'>
                {/* <button onClick={openModal} class=' rounded-sm flex items-center justify-center h-[32px] px-[11px] mr-[5px]'>
                  <HeartOutlineIcon stroke={'white'} classes={'w-6 h-6 mr-[3px]'} />
                </button> */}
                {/* <button onClick={openModal} class='bg-gray-900/50 rounded-full flex items-center justify-center w-[25px] h-[25px] px-[11px]'>
                  <AddIcon fill={'white'} classes={'w-7 h-7'} />
                </button> */}
                <button onClick={openModal} class='bg-gray-900/50 rounded-full p-[0.2rem]'>
                  {' '}
                  <AddIcon fill={'white'} classes={'w-4 h-4'} />
                </button>
              </div>
            </div>
            <Link to={`view/pin/${props?.pin.id}`} style={{ cursor: 'zoom-in' }} state={{ background: location }}>
              <div
                style={{ height: `${imageRef.current.height + 'px'}` }}
                class={`absolute z-10 bg-gray-900/50 rounded-xl inset-0 inline-block`}
              ></div>
            </Link>
          </div>
        )}

        <div class={`relative`}>
          <img
            ref={imageRef}
            src={props.pin?.img_url}
            alt='pin'
            class={`max-h-full object-cover object-center box-content max-w-full rounded-xl ${isInArray === true && 'h-[600px]'}`}
          />
          <div class='flex mt-[25px]'>
            <div class='w-full flex items-center'>
              <div class='flex  items-center w-[75%]'>
                <img class='w-[20px] h-[20px] rounded-full' src={users?.filter((usr) => usr.uid === props.pin.author)[0].photoURL} />
                <p class='font-[700] text-[14px] ml-[7px] tracking-normal'>{props?.pin?.title}</p>
              </div>
              {/* <div class='w-[24%] flex items-center justify-between'>
                <span class='flex items-center font-bold text-[12px]'>
                  <HeartOutlineIcon stroke={'#000000'} fill={'#000000'} classes={'w-4 h-4 '} />
                </span>
                <span onClick={openModal} class='flex items-center font-bold text-[12px] cursor-pointer '>
                  <AddSolidIcon classes={'w-3 h-3  fill-[#000000]'} />
                </span>
                <span onClick={openModal} class='flex items-center font-bold text-[12px] cursor-pointer '>
                  <SendIcon classes={'w-4 h-4  fill-[#000000]'} />
                </span>
              </div> */}
            </div>
          </div>
        </div>
      </div>

      <div>
        <Modal isOpen={toggleModal} closeModal={closeModal} openModal={openModal} title={'Save To Board'} modalHeight={'h-[65vh]'}>
          <SaveToBoard id={props.pin.id} />
        </Modal>
      </div>
    </div>
  );
};

const PinList = (props) => {
  const images = props.pins?.map((pin, i) => {
    return <PinCard key={i} pin={pin} index={i} />;
  });

  return <div class='columns-5 gap-[25px] inline-block '>{images}</div>;
};

const PinBoard = () => {
  const { pins, userFollowing, user } = useAuthState();
  const [followingPins, setFollowingPins] = useState();

  useEffect(() => {
    const following_pins = userFollowing.filter((usr) => usr.user).map((id) => id.user);
    following_pins.push(user?.uid);
    setFollowingPins(following_pins);
    console.log(following_pins);
  }, []);

  const filtered_pins = pins?.filter((item) => {
    return followingPins?.includes(item?.author);
  });

  return (
    <Fragment>
      {/* <TrendingTags /> */}
      {filtered_pins?.length === 0 ? (
        <div class='flex w-full items-center justify-center h-full'>
          <div class='flex w-[90%] items-center justify-center h-[89vh]'>
            <h1 class='font-bold text-[1.5rem]'>Add a pin to get started</h1>
          </div>
        </div>
      ) : (
        <Fragment>
          <PinList pins={filtered_pins} />
        </Fragment>
      )}
    </Fragment>
  );
};

const Loading = () => {
  const [loading, setLoading] = useState(true);
  let [color, setColor] = useState('#E53132');

  const override = css`
    display: block;
    margin: 0 auto;
    padding: 4rem 0 0 0;
    border-color: red;
  `;
  return (
    <Fragment>
      <div class='flex flex-col items-center'>
        <HashLoader color={color} loading={loading} css={override} size={50} />
        <h1 class='font-bold text-xl my-[1rem]'>Updating your feed</h1>
      </div>
    </Fragment>
  );
};

const TrendingTags = () => {
  const data = ['Fashion', 'Art', 'Design', 'Film', 'Photography', 'Makeup', 'Beauty', 'News', 'Nail Art', 'Spiritual'];
  return (
    <div class='flex w-full h-20 flex items-center '>
      <div class='flex w-[7rem] border-r-[1px] border-slate-200 items-center'>
        <div>
          <h2 class='font-[600] text-xl pr-[10px]'>Trending</h2>
        </div>
        {/* <div>
          <TrendingIcon classes={'w-5 h-5'} />
        </div> */}
      </div>

      <div class='w-[89%] pl-[10px]'>
        <Marquee>
          {data.map((tag, i) => (
            <div key={i} class='w-[10%] flex items-center justify-center'>
              <h3 class=' text-lg text-placeholders font-[600]'>{tag}</h3>
            </div>
          ))}
        </Marquee>
      </div>
    </div>
  );
};

const Gallery = () => {
  const { user } = useAuthState();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const isLoading = setTimeout(() => {
      setLoading({ loading: false });
    }, 2500);
  }, []);

  return (
    <div class='w-[95%] m-0'>
      <div>{loading === true ? <Loading /> : <PinBoard user={user} />}</div>
    </div>
  );
};

export default Gallery;
