'use client';
import { app, firestore } from '@/lib/firebase';
import { getAuth, signOut } from 'firebase/auth';
import {
	addDoc,
	collection,
	getDocs,
	onSnapshot,
	query,
	serverTimestamp,
	where,
} from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import UserCard from './UserCard';

function Users({ userData }) {
	const [activeTab, setActiveTab] = useState('users');
	const [loading, setLoading] = useState(true);
	const [loading2, setLoading2] = useState(false);
	const [users, setUsers] = useState([]);
	const [userChatrooms, setUserChatrooms] = useState([]);
	const auth = getAuth(app);
	const router = useRouter();

	const handleTabClick = tab => {
		setActiveTab(tab);
	};
	useEffect(() => {
		const tastQuery = query(collection(firestore, 'users'));
		const unsubscribe = onSnapshot(tastQuery, querySnapshot => {
			const users = querySnapshot.docs.map(doc => ({
				id: doc.id,
				...doc.data(),
			}));
			setUsers(users);
			setLoading(false);
		});
		return unsubscribe;
	}, []);
	const handleLogout = () => {
		signOut(auth)
			.then(() => {
				toast.success('Logged out successfully');
				router.push('/login');
			})
			.catch(error => {
				toast.error(error.message);
			});
	};
	const createChat = async user => {
		const existingChatroom = query(
			collection(firestore, 'chatrooms'),
			where('users', '==', [userData.id, user.id]),
		);
		try {
			const existingChatroomSnapshot = await getDocs(existingChatroom);
			if (existingChatroomSnapshot.docs.length > 0) {
				toast.error('Chatroom already exists');
				return;
			}
			const usersData = {
				[userData.id]: userData,
				[user.id]: user,
			};
			const chatroomData = {
				users: [userData.id, user.id],
				usersData,
				timestamp: serverTimestamp(),
				lastMessage: null,
			};
			const chatroomRef = await addDoc(
				collection(firestore, 'chatrooms'),
				chatroomData,
			);
			toast.success('Chatroom created successfully');
			console.log('chatroom created with id', chatroomRef.id);
			setActiveTab('chatrooms');
		} catch (error) {
			toast.error(error.message);
		}
	};
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
				<button onClick={handleLogout} className={`btn btn-outline `}>
					Logout
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
						{loading ? (
							<p>Loading ...</p>
						) : (
							users.map(
								user =>
									user.id !== userData.id && (
										<div key={user.id} onClick={() => createChat(user)}>
											<UserCard
												name={user.name}
												avatarUrl={user.avatarUrl}
												time='2h ago'
												type={'users'}
											/>
										</div>
									),
							)
						)}
					</>
				)}
			</div>
		</div>
	);
}

export default Users;
