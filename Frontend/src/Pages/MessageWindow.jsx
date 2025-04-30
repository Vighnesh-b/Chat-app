import MessageBox from '../components/MessageBox';
import MessageHeader from '../components/messageHeader';
function MessageWindow() {
  return (
    <>
    <div className="fixed top-0 right-0 h-screen bg-[#000000] w-2/3 flex flex-col">
    <MessageHeader/>
      <div className="flex-1 overflow-y-auto p-4">
      </div>
      <MessageBox />
    </div>
    </>
  );
}

export default MessageWindow;
