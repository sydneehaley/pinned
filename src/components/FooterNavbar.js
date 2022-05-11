import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import AddIcon from "./UI/Icons/AddIcon";
import BoardsIcon from "./UI/Icons/BoardsIcon";
import QuestionMarkIcon from "@mui/icons-material/QuestionMark";
import DropDownMenu from "./UI/DropdownMenu";
const FooterNavbar = ({ openModal }) => {
  const [scrolled, setScrolled] = useState(false);

  const handleScroll = () => {
    const offset = window.scrollY;
    if (offset > 200) {
      setScrolled(true);
    } else {
      setScrolled(false);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
  });

  const DropDownMenuButton = () => {
    return <AddIcon classes={"h-6 w-6 m-0"} fill={"black"} />;
  };

  return (
    <div class={scrolled ? "fixed z-20 flex flex-col left-[95%] top-[77%]  h-[10rem] justify-between" : "fixed z-20 flex flex-col left-[95%] top-[77%] h-[10rem]  justify-between"}>
      {" "}
      <div></div>
      <div>
        <button class='flex items-center justify-center bg-white shadow-lg rounded-full w-[50px] h-[50px]'>
          <DropDownMenu
            one={"Create Board"}
            two={"Create Pin"}
            button={DropDownMenuButton}
            buttonClasses={"flex items-center justify-center m-0"}
            menuClasses={"absolute right-0 w-56 mt-2 mr-2 origin-top-right bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-20"}
            linkOne={null}
            linkTwo={"/create/pin"}
            linkThree={null}
            linkFour={null}
            linkFive={null}
            onClickOne={openModal}
          />
        </button>
      </div>
      <div>
        <button class='flex items-center justify-center bg-white shadow-lg rounded-full w-[50px] h-[50px]'>
          <QuestionMarkIcon sx={{ fontSize: 22 }} />
        </button>
      </div>
    </div>
  );
};

export default FooterNavbar;
