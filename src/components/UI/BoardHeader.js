import { Link } from 'react-router-dom';
import Button from './Button';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { useAuthState } from '../../firebase/config';

const BoardHeader = ({ id, boards, user, author }) => {
  const { users } = useAuthState();
  return (
    <div class='h-[40vh] w-[97%] flex  justify-center'>
      <div class='flex flex-col'>
        <div class='flex justify-center'>
          {user?.photoURL === '' ? (
            <AccountCircleIcon style={{ fontSize: '2rem' }} />
          ) : (
            <img
              class='rounded-full border border-solid border-input_gray p-[3px] object-cover w-[60px] h-[60px]'
              src={user?.photoURL || users.filter((usr) => usr.uid === author)}
            />
          )}
        </div>

        {boards
          ?.filter((board) => board.id === id)
          .map((board) => (
            <div class='flex flex-col items-center'>
              <h1 class='text-[2.7rem] font-bold leading-4 leading-[1.5] mt-[1rem]'>{board?.title}</h1>
              <h6 class='text-black mb-[1rem] font-[400] text-[14px]'>{board?.description}</h6>
            </div>
          ))}

        <div class='w-full flex flex-col items-center'>
          <div class='flex mt-[1.4rem] items-center justify-center'>
            <Button
              background={'bg-neutral-200'}
              hover={'hover:bg-black hover:text-white'}
              color={'text-black'}
              classes={'py-[12px] px-[1rem] min-h-[48px] min-w-[60px] outline-0'}
            >
              <Link to='/settings'>{user?.uid === author ? 'Edit Board' : 'Share'}</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BoardHeader;
