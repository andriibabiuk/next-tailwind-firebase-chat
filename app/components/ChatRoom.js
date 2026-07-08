import MessageCard from './MessageCard';
import MessageInput from './MessageInput';

function ChatRoom({ user }) {
	const messages = [
		{
			id: 1,
			sender: 'katy perry',
			avatarUrl:
				'https://avataaars.io/?accessoriesType=Wayfarers&avatarStyle=Circle&clotheColor=Black&clotheType=Hoodie&eyeType=WinkWacky&eyebrowType=UnibrowNatural&facialHairColor=Brown&facialHairType=BeardLight&hairColor=Auburn&hatColor=Gray02&mouthType=Tongue&skinColor=Black&topType=ShortHairFrizzle',
			content: 'Hey, how are you?',
			time: '2h ago',
		},
		{
			id: 2,
			sender: 'test',
			avatarUrl:
				'https://avataaars.io/?accessoriesType=Wayfarers&avatarStyle=Circle&clotheColor=Black&clotheType=Hoodie&eyeType=WinkWacky&eyebrowType=UnibrowNatural&facialHairColor=Brown&facialHairType=BeardLight&hairColor=Auburn&hatColor=Gray02&mouthType=Tongue&skinColor=Black&topType=ShortHairFrizzle',
			content: 'Hey, how are you?',
			time: '2h ago',
		},
	];
	return (
		<div className='flex flex-col h-screen'>
			<div className='flex-1 overflow-y-auto p-10'>
				{messages?.map(message => (
					<MessageCard key={message.id} message={message} user={'test'} />
				))}
			</div>
			<MessageInput />
		</div>
	);
}

export default ChatRoom;
