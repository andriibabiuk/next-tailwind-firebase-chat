import { FaPaperclip, FaPaperPlane } from 'react-icons/fa';

function MessageInput({ sendMessage, message, setMessage }) {
	return (
		<div className='flex items-center p-4 border-t border-gray-200'>
			<FaPaperclip className='text-gray-500 mr-2' />
			<input
				type='text'
				placeholder='Type a message...'
				className='flex-1 border-none p-2 outline-none'
				value={message}
				onChange={e => setMessage(e.target.value)}
			/>
			<FaPaperPlane
				onClick={() => {
					sendMessage();
				}}
				className='text-gray-500 ml-2 cursor-pointer'
			/>
		</div>
	);
}

export default MessageInput;
