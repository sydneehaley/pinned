import { Link } from 'react-router-dom';
import ImageIcon from './Icons/ImageIcon';

const UserProfileBoards = ({ boards, pins }) => {
  return (
    <div class='w-full flex items-start justify-start'>
      <div class='w-full'>
        <div class='grid grid-cols-5 gap-[9px]'>
          {boards?.map((board, i) => (
            <div key={i} class='w-full h-[11rem]'>
              <Link to={`/boards/${board?.id}`} style={{ cursor: 'pointer' }}>
                {pins?.filter((img) => img.board === board?.title)?.length === 0 ? (
                  <div key={board.id} class='bg-neutral-200 h-[11rem] rounded-md col-span-1 flex items-center justify-center'>
                    <ImageIcon classes={'w-8 h-8'} fill={'#767676'} />
                  </div>
                ) : (
                  <div key={board.id} class='col-span-1'>
                    <img
                      class='h-[11rem] w-full  rounded-md rounded-xl object-cover'
                      src={
                        pins?.filter((img) => img?.board === board?.title)[`${pins?.filter((boards) => boards.board === board.title)?.length - 1}`]
                          ?.img_url
                      }
                    />
                  </div>
                )}
              </Link>
              <h6 class='font-bold mt-[1rem]'>{board?.title}</h6>
              <span class='text-[12px]'>{pins.filter((boards) => boards.board === board.title).length} pins</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UserProfileBoards;
