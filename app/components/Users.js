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
import { FaSignOutAlt } from 'react-icons/fa';
import toast from 'react-hot-toast';
import UserCard from './UserCard';

function Users({ userData, setSelectedChatroom }) {
	const [activeTab, setActiveTab] = useState('users');
	const [loading, setLoading] = useState(true);
	const [loading2, setLoading2] = useState(true);
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

	useEffect(() => {
		if (!userData) {
			return;
		}
		const chatroomsQuery = query(
			collection(firestore, 'chatrooms'),
			where('users', 'array-contains', userData.id),
		);
		const unsubscribe = onSnapshot(chatroomsQuery, querySnapshot => {
			const chatrooms = querySnapshot.docs.map(doc => ({
				id: doc.id,
				...doc.data(),
			}));
			setUserChatrooms(chatrooms);
			setLoading2(false);
		});
		return unsubscribe;
	}, [userData]);
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
	const openChat = chatroom => {
		const data = {
			id: chatroom.id,
			myData: userData,
			otherData:
				chatroom.usersData[chatroom.users.find(id => id !== userData.id)],
		};
		setSelectedChatroom(data);
	};
	const otherUsers = users.filter(user => user.id !== userData.id);
	return (
		<div className='flex flex-col h-screen'>
			<div className='flex items-center justify-between p-4 border-b border-base-300'>
				<h1 className='text-lg font-semibold'>
					<span className='text-primary'>Chat</span>
					<span className='font-bold text-secondary'>2</span>
					<span className='text-primary'>Chat</span>
				</h1>
				<button
					onClick={handleLogout}
					className='btn btn-ghost btn-sm btn-circle'
					title='Logout'
				>
					<FaSignOutAlt />
				</button>
			</div>
			<div className='tabs tabs-boxed mx-4 mt-4'>
				<button
					onClick={() => handleTabClick('users')}
					className={`tab ${activeTab === 'users' ? 'tab-active' : ''}`}
				>
					Users
				</button>
				<button
					onClick={() => handleTabClick('chatrooms')}
					className={`tab ${activeTab === 'chatrooms' ? 'tab-active' : ''}`}
				>
					Chatrooms
				</button>
			</div>
			<div className='flex-1 overflow-auto mt-2'>
				{activeTab === 'chatrooms' && (
					<div>
						{loading2 ? (
							<div className='flex justify-center p-8'>
								<span className='loading loading-spinner loading-md text-primary'></span>
							</div>
						) : userChatrooms.length === 0 ? (
							<p className='text-center text-sm text-base-content/60 p-8'>
								No chatrooms yet. Start one from the Users tab.
							</p>
						) : (
							userChatrooms.map(chatroom => {
								const otherUserId = chatroom.users.find(
									id => id !== userData.id,
								);
								const otherUser = chatroom.usersData[otherUserId];
								return (
									<div
										key={chatroom.id}
										onClick={() => openChat(chatroom)}
										className='mx-2 rounded-lg hover:bg-base-200 cursor-pointer transition-colors'
									>
										<UserCard
											name={otherUser.name}
											avatarUrl={otherUser.avatarUrl}
											latestMessageText={chatroom.lastMessage}
										/>
									</div>
								);
							})
						)}
					</div>
				)}
				{activeTab === 'users' && (
					<div>
						{loading ? (
							<div className='flex justify-center p-8'>
								<span className='loading loading-spinner loading-md text-primary'></span>
							</div>
						) : otherUsers.length === 0 ? (
							<p className='text-center text-sm text-base-content/60 p-8'>
								No other users yet.
							</p>
						) : (
							otherUsers.map(user => (
								<div
									key={user.id}
									onClick={() => createChat(user)}
									className='mx-2 rounded-lg hover:bg-base-200 cursor-pointer transition-colors'
								>
									<UserCard name={user.name} avatarUrl={user.avatarUrl} />
								</div>
							))
						)}
					</div>
				)}
			</div>
		</div>
	);
}

export default Users;
