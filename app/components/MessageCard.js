import Image from 'next/image';

function MessageCard({ message, user }) {
	const isMessageFromMe = message.sender === user;

	return (
		<div
			key={message.id}
			className={`flex mb-4 ${isMessageFromMe ? 'justify-end' : 'justify-start'}`}
		>
			<div className={`w-10 h-10 mr-2 shrink-0 ${isMessageFromMe ? 'ml-2' : ''}`}>
				<Image
					src={message.avatarUrl}
					alt='avatar'
					width={40}
					height={40}
					className='w-full h-full rounded-full object-cover'
				/>
			</div>
			<div
				className={`text-white p-2 rounded-md ${isMessageFromMe ? 'bg-blue-500 self-end' : 'bg-[#19D39E] self-start'}`}
			>
				<p>{message.content}</p>
				<div className='text-xs text-gray-300'>{message.time}</div>
			</div>
		</div>
	);
}

export default MessageCard;
