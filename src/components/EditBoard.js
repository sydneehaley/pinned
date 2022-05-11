import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  useAuthState,
  db,
  storage,
} from "../firebase/config";
import {
  doc,
  onSnapshot,
  updateDoc,
} from "firebase/firestore";
import {
  getStorage,
  ref,
  deleteObject,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { css } from "@emotion/react";
import DotLoader from "react-spinners/DotLoader";
import _ from "lodash";
import FindReplaceIcon from "@mui/icons-material/FindReplace";
import UploadIcon from "@mui/icons-material/Upload";

const EditBoard = () => {
  const { user } = useAuthState();
  const { id } = useParams();
  const navigate = useNavigate();
  const boardsRef = doc(
    db,
    "users",
    `${user?.uid}`,
    "content",
    "boards"
  );
  const [loading, setLoading] = useState(false);
  const [deleted, setDeleted] = useState(false);
  const [reUpload, setReUpload] = useState(false);
  const [board, setBoard] = useState();
  const [upload, setUpload] = useState({
    cover_image: "",
    cover_image_file_name: "",
  });
  const [image, setImage] = useState();
  const [errorMsg, setErrorMsg] = useState();
  let [color, setColor] = useState("#767676");

  const override = css`
    display: block;
    margin: 0 auto;
    border-color: red;
  `;

  useEffect(() => {
    const unsub_boards = onSnapshot(boardsRef, (doc) => {
      console.log("Current data: ", doc.data());
      const res = doc.data();
      console.log(res);
      if (res != null) {
        const boards_data = _.values(res);
        setBoard(
          boards_data?.find((board) => board?.id === id)
        );
        console.log(
          boards_data?.find((board) => board?.id === id)
        );
        // setUpload({
        //   cover_image: boards_data?.find((board) => board?.id === id).cover_image,
        //   cover_image_file_name: boards_data?.find((board) => board?.id === id).cover_image_file_name,
        // });
      }
      // setBoard({
      //   cover_image: data?.cover_image,
      //   cover_image_file_name: data?.cover_image_file_name,
      //   title: data?.title,
      //   description: data?.description,
      // });
    });

    return unsub_boards;
  }, []);

  console.log(board);
  console.log(upload);
  console.log(!reUpload);

  const handleOnChange = (e) => {
    e.preventDefault();
    setBoard({
      ...board,
      [e.target.name]: e.target.value,
    });
  };

  const deleteBoardImage = () => {
    const coverImageRef = ref(
      storage,
      `${user?.uid}/boards/cover_images/${board?.cover_image_file_name}`
    );

    deleteObject(coverImageRef)
      .then(() => {
        console.log("image deleted!");
      })
      .catch((error) => {
        console.log("error deleting image");
      });
    setDeleted(!deleted);
    // setBoard({ cover_image: '' });
  };

  const onFileChange = async (e) => {
    const file = e.target.files[0];
    if (
      file.size < 2e6 &&
      file &&
      file.type.substr(0, 5) === "image"
    ) {
      setImage(file);
    } else {
      alert("File size is too big");
    }
    const metadata = {
      contentType: "image/jpeg",
    };
    const storageRef = ref(
      storage,
      `${user?.uid}/boards/cover_images/${file.name}`
    );
    const uploadTask = uploadBytesResumable(
      storageRef,
      file,
      metadata
    );

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred /
            snapshot.totalBytes) *
          100;
        setLoading(true);
        console.log("Upload is " + progress + "% done");
        switch (snapshot.state) {
          case "paused":
            console.log("Upload is paused");
            break;
          case "running":
            console.log("Upload is running");
            break;
        }
      },

      (error) => {
        console.log(error);
      },
      () => {
        setLoading(false);
        console.log(loading);
        // Handle successful uploads on complete
        // For instance, get the download URL: https://firebasestorage.googleapis.com/...
        getDownloadURL(uploadTask.snapshot.ref).then(
          (downloadURL) => {
            console.log("File available at", downloadURL);
            if (board != null) {
              setBoard({
                ...board,
                cover_image: downloadURL,
                cover_image_file_name: file.name,
              });
            }
          }
        );
      }
    );
  };

  const propertyId = `${id}.id`;
  const propertyPublicAuthor = `${id}.public_author`;
  const propertyAuthor = `${id}.author`;
  const propertyPublic = `${id}.public`;
  const propertyCoverImage = `${id}.cover_image`;
  const propertyCoverImageFileName = `${id}.cover_image_file_name`;
  const propertyDesc = `${id}.description`;
  const propertyTitle = `${id}.title`;

  const updateUserContent = async () => {
    await updateDoc(boardsRef, {
      [propertyCoverImage]: `${board?.cover_image}`,
      [propertyCoverImageFileName]: `${board?.cover_image_file_name}`,
      [propertyDesc]: `${board?.description}`,
      [propertyTitle]: `${board?.title}`,
      [propertyId]: `${board?.id}`,
      [propertyAuthor]: `${board?.author}`,
      [propertyPublicAuthor]: `${board?.public_author}`,
      [propertyPublic]: `${board?.public}`,
    });
  };

  const handleOnSubmit = (e) => {
    e.preventDefault();
    updateUserContent();
    navigate("/", { replace: true });
  };

  return (
    <div className='container__form'>
      <div className='form'>
        <h1>Edit Board</h1>
        <div className='form__container'>
          <form onSubmit={handleOnSubmit}>
            <div className='form__container__left'>
              <div
                className='form__container__left__imgupload--form'
                style={
                  loading === true
                    ? { background: "#efefef" }
                    : {
                        background: `url(${board?.cover_image})`,
                        backgroundSize: "cover",
                      }
                }
              >
                <div className='form__container__left__imgupload--button'>
                  <input
                    hidden
                    id='uploadImg'
                    type='file'
                    accept='image/*'
                    onChange={onFileChange}
                  />

                  <label for='uploadImg'>
                    <div className='form__container__left__imgupload--button--delete'>
                      <FindReplaceIcon
                        onClick={deleteBoardImage}
                        style={{ cursor: "pointer" }}
                      />
                    </div>
                  </label>
                </div>

                {loading === true && (
                  <div>
                    <DotLoader
                      color={color}
                      loading={loading}
                      css={override}
                      size={60}
                    />
                  </div>
                  // ) : (
                  // <div className='form__container__left__imgupload--uploadedimg'>{/* <img src={board?.cover_image} alt='pin_image' /> */}</div>
                )}
              </div>
            </div>
            <div className='form__container__right'>
              <div className='form__container__right__form__selection'>
                <div className='form__container__right__form__selection__form'>
                  <button type='submit' value='submit'>
                    Save
                  </button>
                </div>
              </div>
              {errorMsg && (
                <div className='form__container__right__form--error'>
                  <p>{errorMsg}</p>
                </div>
              )}
              <div className='form__container__right__form'>
                <div
                  className='form__container__right__form__input'
                  id='title-input'
                >
                  <input
                    type='text'
                    placeholder='Add your title'
                    name='title'
                    value={board?.title}
                    onChange={handleOnChange}
                  ></input>
                </div>
                <div className='form__container__right__form__input'>
                  <input
                    type='text'
                    placeholder='Tell everyone what your board is about'
                    name='description'
                    value={board?.description}
                    onChange={handleOnChange}
                  ></input>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditBoard;
