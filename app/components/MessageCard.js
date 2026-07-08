import moment from 'moment';
import Image from 'next/image';

function MessageCard({ message, me, other }) {
	const isMessageFromMe = message.sender === me.id;
	const avatarUrl = isMessageFromMe ? me.avatarUrl : other.avatarUrl;
	const avatarAlt = isMessageFromMe ? me.name : other.name;
	const timeAgo = time => {
		if (!time) {
			return 'sending...';
		}
		const date = time.toDate();
		const momentDate = moment(date);
		return momentDate.fromNow();
	};
	return (
		<div className={`chat ${isMessageFromMe ? 'chat-end' : 'chat-start'}`}>
			<div className='chat-image avatar'>
				<div className='w-10 rounded-full'>
					<Image src={avatarUrl} alt={avatarAlt} width={40} height={40} />
				</div>
			</div>
			{message.image && (
				<div
					className={`chat-bubble p-1 ${isMessageFromMe ? 'chat-bubble-primary' : 'chat-bubble-accent'}`}
				>
					<Image
						src={message.image}
						alt='Shared image'
						width={240}
						height={160}
						className='w-60 h-40 object-cover rounded-md'
					/>
				</div>
			)}
			{message.content && (
				<div
					className={`chat-bubble ${isMessageFromMe ? 'chat-bubble-primary' : 'chat-bubble-accent'}`}
				>
					{message.content}
				</div>
			)}
			<div className='chat-footer text-xs text-base-content/50 mt-1'>
				{timeAgo(message.time)}
			</div>
		</div>
	);
}

export default MessageCard;
