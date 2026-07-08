import moment from 'moment';
import Image from 'next/image';

function MessageCard({ message, me, other }) {
	const isMessageFromMe = message.sender === me.id;
	const timeAgo = time => {
		if (!time) {
			return 'sending...';
		}
		const date = time.toDate();
		const momentDate = moment(date);
		return momentDate.fromNow();
	};
	return (
		<div
			key={message.id}
			className={`flex mb-4 ${isMessageFromMe ? 'justify-end' : 'justify-start'}`}
		>
			<div
				className={`w-10 h-10 mr-2 shrink-0 ${isMessageFromMe ? 'ml-2' : ''}`}
			>
				{!isMessageFromMe && (
					<Image
						src={other.avatarUrl}
						alt='avatar'
						width={40}
						height={40}
						className='w-full h-full rounded-full object-cover'
					/>
				)}
				{isMessageFromMe && (
					<Image
						src={me.avatarUrl}
						alt='avatar'
						width={40}
						height={40}
						className='w-full h-full rounded-full object-cover'
					/>
				)}
			</div>
			<div
				className={`text-white p-2 rounded-md ${isMessageFromMe ? 'bg-blue-500 self-end' : 'bg-[#19D39E] self-start'}`}
			>
				{message.image && (
					// eslint-disable-next-line @next/next/no-img-element
					<img
						className='w-60 h-40 object-cover rounded-md'
						src={message.image}
						alt='Message'
					/>
				)}
				<p>{message.content}</p>
				<div className='text-xs text-gray-300'>{timeAgo(message.time)}</div>
			</div>
		</div>
	);
}

export default MessageCard;
