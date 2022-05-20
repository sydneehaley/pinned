import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAuthState } from '../firebase/config';
import PinList from './UI/PinList';
import MultiplePinsIcon from './UI/Icons/MultiplePinsIcons';
import BoardHeader from './UI/BoardHeader';

const Board = () => {
  const { user, boards } = useAuthState();
  const { id } = useParams();
  const [board, setBoard] = useState({
    author: '',
    title: '',
  });

  useEffect(() => {
    setBoard({
      author: boards?.filter((board) => board.id == id)[0]?.author,
      title: boards?.filter((board) => board.id == id)[0]?.title,
    });
  }, []);

  return (
    <div class='w-full flex flex-col items-center mt-[2rem]'>
      <BoardHeader id={id} boards={boards} user={user} author={board?.author} />

      <PinBoard id={id} title={board?.title} />
    </div>
  );
};

const PinBoard = ({ title }) => {
  const { pins } = useAuthState();
  const filtered_pins = pins?.filter((pin) => pin?.board == title);
  console.log(filtered_pins);

  return (
    <div class='w-[97%] flex items-center justify-center'>
      {filtered_pins?.length === 0 ? (
        <div class='flex items-center justify-center'>
          <h1 class='font-bold text-[1.2rem]'>No pins added to board</h1>
        </div>
      ) : (
        <div class='w-full flex items-center justify-center'>
          <div class='flex flex-col w-[97%] mb-[10rem]'>
            <div class='flex w-[3.5rem] bg-custom_green rounded-md mb-[2rem] p-[0.4rem] items-center justify-center font-bold text-[14px]'>
              <MultiplePinsIcon />
              <span class='ml-[5px]'>{filtered_pins?.length}</span>
            </div>
            <PinList pins={filtered_pins} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Board;
