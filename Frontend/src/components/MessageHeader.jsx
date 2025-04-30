import getRandomProfile from './random_img.js'
function MessageHeader() {
    return (
      <div className="bg-gray-900 w-full p-5">
        <div className="flex items-center gap-4">
          <img
            src={getRandomProfile()}
            alt="User Profile"
            className="w-10 h-10 rounded-full object-cover"
          />
          <p className="text-white font-bold text-lg">Person</p>
        </div>
      </div>
    );
  }

  export default MessageHeader;
  