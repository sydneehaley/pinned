import React, { useState, useEffect } from "react";
import _ from "lodash";
import { useDispatch } from "react-redux";
import AddIcon from "./Icons/AddIcon";
import { db, useAuthState } from "../../firebase/config";
import SearchIcon from "./Icons/SearchIcon";
import Button from "./Button";
import { doc, updateDoc, setDoc } from "firebase/firestore";
import Modal from "./Modal";
import ImageIcon from "./Icons/ImageIcon";

const SaveToBoard = ({ id, buttonClasses, iconStroke }) => {
  console.log(id);
  const { pins, user, userBoards, userPins, userSavedPins } = useAuthState();
  const [boardTitle, setBoardTitle] = useState();
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [toggleModal, setToggleModal] = useState(false);
  const [currIndex, setCurrIndex] = useState(0);
  const [own, setOwn] = useState(false);
  const [saved, setSaved] = useState(false);

  console.log(boardTitle);

  useEffect(() => {
    setLoading(true);
    if (userPins?.filter((pin) => pin?.id === id).length !== 0) {
      setBoardTitle(userPins.filter((pin) => pin?.id === id)[0]?.board);
      console.log("user owns pin");
      setOwn(true);
      setLoading(false);
    }

    if (userSavedPins?.filter((pin) => pin?.id === id).length !== 0) {
      setBoardTitle(userSavedPins.filter((pin) => pin?.id === id)[0]?.savedToMyBoard);
      console.log("user saved pin");
      setSaved(true);
      setLoading(false);
    }
    if (userPins?.filter((pin) => pin?.id === id).length === 0 && userSavedPins?.filter((pin) => pin?.id === id).length === 0) {
      console.log("pin not owned or saved");
      setBoardTitle(userBoards[0]);
      setLoading(false);
    }
  }, []);

  const handleOnChange = (e) => {
    e.preventDefault();
    setQuery(e.target.value);
  };

  const updateMyPin = async (board) => {
    const pinRef = doc(db, "content", `${id}`);
    await updateDoc(pinRef, {
      board: board.title,
    });
  };

  const addSavedPin = async (saveToMyBoard) => {
    const newSavedPinRef = doc(db, `${user?.uid}`, `${id}`);
    await setDoc(newSavedPinRef, saveToMyBoard);
  };

  const updateSavedPin = async (board) => {
    const savedPinRef = doc(db, `${user?.uid}`, `${id}`);
    await updateDoc(savedPinRef, {
      savedToMyBoard: board.title,
    });
  };

  const handleBoardChange = (board) => {
    setBoardTitle(board.title);

    console.log(boardTitle);

    if (own === true) {
      updateMyPin(board);
      console.log("pin owned");
    }

    if (own === false && saved === false) {
      const findPin = pins?.filter((pin) => pin?.id === id);
      const saveToMyBoard = findPin?.map(function (pin, i) {
        return Object.assign(pin, { savedToMyBoard: board.title, saved: true });
      });

      console.log(saveToMyBoard[0]);
      addSavedPin(saveToMyBoard[0]);
    }

    if (saved === true) {
      updateSavedPin(board);
    }
  };

  const openModal = () => {
    setToggleModal(true);
  };

  const closeModal = () => {
    setToggleModal(false);
  };

  return (
    <div class=''>
      <div class=''>
        <div class='h-[7vh] flex items-center'>
          <div class='absolute h-[50px] flex items-center left-[40px]'>
            <SearchIcon classes={"w-5 h-5"} fill={"#767676"} />
          </div>

          <input class='border-inputGray border-2 w-full rounded-full h-[50px] focus:outline-0 pt-[1rem] pb-[1rem] pr-[1rem] pl-[2.7rem]' value={query} onChange={handleOnChange} />
        </div>
        <div class='overflow-x-scroll  h-[40vh]'>
          <h6 class='font-bold h-[7vh] flex items-center text-[14px]'>My Boards</h6>
          {userBoards
            ?.filter((board) => {
              if (query == "") {
                return userBoards;
              } else if (board.title?.toLowerCase().includes(query)) {
                return board;
              }
            })
            .map((board, i) => {
              return (
                <div key={i} class={`cursor-default select-none relative py-2 pr-2 rounded-xl mb-[0.5rem] hover:bg-[#f9fafb]`} name='title' value={board}>
                  <div
                    class='h-[3rem] flex items-center'
                    onMouseOver={() => {
                      setCurrIndex(i);
                    }}
                    onMouseLeave={() => {
                      setCurrIndex(null);
                    }}
                  >
                    <div className={`block truncate flex items-center font-bold pl-[10px]`}>
                      {userPins?.filter((img) => img.board === board?.title).length === 0 ? (
                        <div class='bg-lightest_gray w-[50px] h-[50px] rounded-xl flex items-center justify-center'>
                          <ImageIcon classes={"w-5 h-5"} fill={"placeholders"} />
                        </div>
                      ) : (
                        <img class='w-[50px] h-[50px] rounded-xl object-cover' src={userPins?.filter((img) => img?.board === board?.title)[0]?.img_url} />
                      )}
                      <span class='pl-[10px]'>{board?.title}</span>
                    </div>
                    <span className='absolute inset-y-0 left-[0] flex items-center flex w-full justify-end text-red'>
                      {/* {selected && (
                                    <span className='absolute inset-y-0 left-[0] flex items-center flex w-full justify-end text-red pr-[10px]'>
                                      <CheckIcon className='w-5 h-5' aria-hidden='true' />
                                    </span>
                                  )} */}

                      {currIndex === i && (
                        <Button
                          background={boardTitle === board?.title ? "bg-red" : "bg-lightest_gray"}
                          color={boardTitle === board?.title ? "text-white" : "text-black"}
                          hover={"hover:bg-black hover:text-white"}
                          onClickAction={() => handleBoardChange(board)}
                          classes={"py-[12px] px-[1rem] min-h-[48px] min-w-[60px] outline-0 mr-[1rem]"}
                        >
                          {boardTitle === board?.title ? "Saved" : "Select"}
                        </Button>
                      )}
                    </span>
                  </div>
                </div>
              );
            })}
        </div>{" "}
      </div>
      <div class='flex items-center justify-center w-full h-[10vh] border-t border-solid border-inputGray bg-transparent  '>
        <div class='bg-red w-9 h-9 rounded-full flex items-center justify-center '>
          <button class='bg-red w-6 h-6 rounded-full flex items-center justify-center  cursor-pointer ' onClick={openModal}>
            <AddIcon fill={"white"} class='cursor-pointer' />
          </button>
        </div>
      </div>
    </div>
  );
};

export default SaveToBoard;
