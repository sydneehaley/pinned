import Button from "./Button";
import { Link } from "react-router-dom";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

const ProfileHeader = ({ usr, followersCount, followingCount, handleFollowers, handleFollowing, verifyFollowing, isCurrentUser }) => {
  return (
    <div class=' h-[50vh]  flex justify-center'>
      <div class='flex  w-full flex-col items-center'>
        <div class='w-[90px] h-[90px] rounded-full'>
          {usr?.photoURL === "" ? (
            <AccountCircleIcon style={{ fontSize: "2rem" }} />
          ) : (
            <img class='rounded-full border border-solid border-input_gray p-[3px] object-cover w-[90px] h-[90px]' src={usr?.photoURL} />
          )}
        </div>

        <div class='w-[40rem] flex flex-col items-center'>
          {usr?.name === "" ? (
            <h1 class='text-[2.7rem] font-bold leading-4 leading-[1.3] mt-[1rem]'>Jane Doe</h1>
          ) : (
            <h1 class='text-[2.7rem] font-bold leading-4 leading-[1.3] mt-[1rem]'>{usr?.name}</h1>
          )}
          {usr?.username === "" ? <h6 class='text-custom_gray mb-[1rem] font-medium'>@username</h6> : <h6 class='text-custom_gray mb-[1rem] font-medium'>@{usr?.displayName}</h6>}
          <div class='flex'>
            <p class='leading-normal mb-[1rem] font-regular mr-[10px]'>{usr?.website}</p> · <p class='leading-normal mb-[1rem] font-regular ml-[10px]'>{usr?.tagline}</p>
          </div>
        </div>

        <div class='w-full flex flex-col items-center'>
          <div class='flex'>
            <ul class='flex font-bold text-center leading-none'>
              <li class='mr-[10px] cursor-pointer' onClick={handleFollowers}>
                {followersCount} Followers
              </li>{" "}
              ·{" "}
              <li class='ml-[10px] cursor-pointer' onClick={handleFollowing}>
                {followingCount} Following
              </li>
            </ul>
          </div>
          <div class='flex mt-[1.4rem] items-center justify-center'>
            {isCurrentUser === true ? (
              <Link to='/settings'>
                <Button
                  background={`${verifyFollowing === true ? "bg-red" : "bg-lightest_gray"}`}
                  hover={"hover:bg-black hover:text-white"}
                  color={`${verifyFollowing === true ? "text-white" : "text-black"}`}
                  classes={"py-[12px] px-[1rem] min-h-[48px] min-w-[60px] outline-0"}
                >
                  Edit Profile
                </Button>{" "}
              </Link>
            ) : (
              <Button
                background={`${verifyFollowing === true ? "bg-red" : "bg-lightest_gray"}`}
                hover={"hover:bg-black hover:text-white"}
                color={`${verifyFollowing === true ? "text-white" : "text-black"}`}
                classes={"py-[12px] px-[1rem] min-h-[48px] min-w-[60px] outline-0"}
              >
                {verifyFollowing === true ? "Following" : "Follow"}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;
