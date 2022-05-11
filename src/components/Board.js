import React, { useEffect, useState, Fragment } from "react";
import { Link, useParams } from "react-router-dom";
import { useAuthState } from "../firebase/config";
import Button from "./UI/Button";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import PinList from "./UI/PinList";
import MultiplePinsIcon from "./UI/Icons/MultiplePinsIcons";

const Board = (props) => {
  const { user, boards } = useAuthState();
  const { id, title } = useParams();
  const [loading, setLoading] = useState(false);
  const [followingCount, setFollowingCount] = useState();
  const [followersCount, setFollowersCount] = useState();

  useEffect(() => {}, []);
  console.log(id);
  console.log(boards.filter((board) => board.id === id));

  return (
    <div class='w-full flex flex-col items-center mt-[2rem]'>
      <div class='h-[50vh] w-[90%] flex'>
        <div class='flex flex-form_side h-full items-start'>{/* <ArrowLeft stroke={'black'} classes={'w-5 w-6'} /> */}</div>
        <div class='flex flex-form_middle basis-4/5 flex-col items-center'>
          <div class='w-[90px] h-[90px] rounded-full'>
            {user?.photoURL === "" ? (
              <AccountCircleIcon style={{ fontSize: "2rem" }} />
            ) : (
              <img class='rounded-full border border-solid border-input_gray p-[3px] object-cover w-[60px] h-[60px]' src={user?.photoURL} />
            )}
          </div>

          {boards
            .filter((board) => board.id === id)
            .map((board) => (
              <div class='flex flex-col items-center'>
                <h1 class='text-[2.7rem] font-bold leading-4 leading-[1.3] mt-[1rem]'>{board?.title}</h1>

                <h6 class='text-custom_gray mb-[1rem] font-medium'>{board?.description}</h6>
                {/* 
                <div class='flex'>
                  <p class='leading-normal mb-[1rem] font-regular mr-[10px]'>{profile?.website}</p> ·{' '}
                  <p class='leading-normal mb-[1rem] font-regular ml-[10px]'>{profile?.tagline}</p>
                </div> */}
              </div>
            ))}

          <div class='w-full flex flex-col items-center'>
            <div class='flex mt-[1.4rem] items-center justify-center'>
              <Button background={"bg-lightest_gray"} hover={"hover:bg-black hover:text-white"} color={"text-black"} classes={"py-[12px] px-[1rem] min-h-[48px] min-w-[60px] outline-0"}>
                <Link to='/settings'>Edit Profile</Link>
              </Button>
            </div>
          </div>
        </div>
        <div class='flex flex-form_side'>{/* <MoreIcon /> */}</div>
      </div>

      <PinBoard id={id} title={title} />
    </div>
  );
};

const PinBoard = ({ title }) => {
  const { pins } = useAuthState();
  const filtered_pins = pins.filter((pins) => pins.board === title);

  return (
    <div>
      {filtered_pins?.length === 0 ? (
        <div class='flex w-full items-center justify-center h-full'>
          <div class='flex w-[90%] items-center justify-center h-[89vh]'>
            <h1 class='font-bold text-[1.5rem]'>Add a pin to get started</h1>
          </div>
        </div>
      ) : (
        <div class='w-full flex items-center justify-center'>
          <div class='flex flex-col w-[95%]'>
            <div class='flex w-[3.5rem] bg-green rounded-md mb-[2rem] p-[0.4rem] items-center justify-center font-bold text-[14px]'>
              <MultiplePinsIcon />
              <span class='ml-[5px]'>{filtered_pins.length}</span>
            </div>
            <PinList pins={filtered_pins} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Board;
