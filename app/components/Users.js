import { useState } from 'react';
import UserCard from './UserCard';
function Users({ user }) {
	const [activeTab, setActiveTab] = useState('users');
	const handleTabClick = tab => {
		setActiveTab(tab);
	};
	if (activeTab === 'users') {
	}
	return (
		<div className='shadow-lg h-screen overflow-auto mt-4 mb-20'>
			<div className='flex justify-between p-4'>
				<button
					onClick={() => handleTabClick('users')}
					className={`btn btn-outline ${activeTab === 'users' ? 'btn-primary' : ''}`}
				>
					Users
				</button>
				<button
					onClick={() => handleTabClick('chatrooms')}
					className={`btn btn-outline ${activeTab === 'chatrooms' ? 'btn-primary' : ''}`}
				>
					Chatrooms
				</button>
			</div>
			<div>
				{activeTab === 'chatrooms' && (
					<>
						<h1 className='px-4 text-base font-semibold'>ChatRooms</h1>
						<UserCard
							name='katy perry'
							avatarUrl='https://avataaars.io/?accessoriesType=Wayfarers&avatarStyle=Circle&clotheColor=Black&clotheType=Hoodie&eyeType=WinkWacky&eyebrowType=UnibrowNatural&facialHairColor=Brown&facialHairType=BeardLight&hairColor=Auburn&hatColor=Gray02&mouthType=Tongue&skinColor=Black&topType=ShortHairFrizzle'
							latestMessageText='Hey, how are you?'
							time='2h ago'
							type={'chat'}
						/>
						<UserCard
							name='katy perry'
							avatarUrl='https://avataaars.io/?accessoriesType=Wayfarers&avatarStyle=Circle&clotheColor=Black&clotheType=Hoodie&eyeType=WinkWacky&eyebrowType=UnibrowNatural&facialHairColor=Brown&facialHairType=BeardLight&hairColor=Auburn&hatColor=Gray02&mouthType=Tongue&skinColor=Black&topType=ShortHairFrizzle'
							latestMessageText='Hey, how are you?'
							time='2h ago'
							type={'chat'}
						/>
					</>
				)}
			</div>
			<div>
				{activeTab === 'users' && (
					<>
						<h1 className='px-4 text-base font-semibold'>Users</h1>
						<UserCard
							name='katy perry'
							avatarUrl='https://avataaars.io/?accessoriesType=Wayfarers&avatarStyle=Circle&clotheColor=Black&clotheType=Hoodie&eyeType=WinkWacky&eyebrowType=UnibrowNatural&facialHairColor=Brown&facialHairType=BeardLight&hairColor=Auburn&hatColor=Gray02&mouthType=Tongue&skinColor=Black&topType=ShortHairFrizzle'
							time='2h ago'
							type={'users'}
						/>
					</>
				)}
			</div>
		</div>
	);
}

export default Users;
