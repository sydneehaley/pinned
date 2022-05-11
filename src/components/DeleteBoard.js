import React, { useRef, useState } from "react";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { toggleDeletePinModal } from "../store/features/appState";
import {
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import {
  doc,
  onSnapshot,
  updateDoc,
  deleteField,
} from "firebase/firestore";
import { db, useAuthState } from "../firebase/config";

const DeleteBoard = () => {
  const { user } = useAuthState();
  const location = useLocation();
  const deleteButton = useRef();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id } = useParams();
  const [data, setData] = useState();
  // console.log(location);
  // const id = location.pathname.replace('/delete/pin/', '');
  console.log(id);
  // const docRef = doc(db, 'users', `${user?.uid}`, 'content', 'pins');
  const docRef = doc(
    db,
    "users",
    `${user?.uid}`,
    "content",
    "boards"
  );
  const globalRef = doc(db, "content", "pins");

  useEffect(() => {
    const unsub = onSnapshot(docRef, (doc) => {
      console.log("Current data: ", doc?.data());
      const res = doc?.data();
      console.log(res);
      setData(res);
      console.log("data fetched");
    });

    return unsub;
  }, []);

  // console.log(data?.pins_public?.filter((pin) => pin.id === id));
  // const pins = data?.pins_public;
  // useEffect(() => {
  //   if ((deleteButton.current = null)) {
  //     deleteButton.current.addEventListener('click', navigate('/'));
  //   }
  // }, [deleteButton]);
  const pin_id = id;

  const deleteFromUser = async () => {
    await updateDoc(docRef, {
      [pin_id]: deleteField(),
    });
  };

  const deleteFromGlobal = async () => {
    await updateDoc(globalRef, {
      [pin_id]: deleteField(),
    });
  };

  const handleOnClick = async (e) => {
    e.preventDefault();
    deleteFromGlobal();
    deleteFromUser();
    dispatch(toggleDeletePinModal());
  };

  return (
    <div>
      {/* {pins
        .filter((pin) => pin.id === id)
        .map((pin, i) => ( */}
      <p>
        <h1>Delete this pin?</h1>
        <button onClick={handleOnClick}>delete</button>
      </p>
    </div>
  );
};

export default DeleteBoard;
