import { useState, useEffect } from 'react';


function MessageBox() {
  
  return (
    <div className="bg-black w-full p-4 flex items-center gap-2">
      <input
        type="text"
        className="flex-1 bg-gray-700 text-white placeholder-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-gray-400"
        placeholder="Type a message"
      />
      <button
        className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-full font-semibold transition duration-200"
      >
        Send
      </button>
    </div>
  );
}

export default MessageBox;
