import { firestore } from '@/lib/firebase';
import {
	addDoc,
	collection,
	doc,
	onSnapshot,
	orderBy,
	query,
	serverTimestamp,
	updateDoc,
	where,
} from 'firebase/firestore';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import MessageCard from './MessageCard';
import MessageInput from './MessageInput';
function ChatRoom({ user, selectedChatroom }) {
	const me = selectedChatroom?.myData;
	const other = selectedChatroom?.otherData;
	const chatroomId = selectedChatroom?.id;
	const [message, setMessage] = useState('');
	const [messages, setMessages] = useState([]);
	const [image, setImage] = useState(null);
	const messagesContainerRef = useRef(null);
	useEffect(() => {
		if (!chatroomId) {
			return;
		}
		const unsubscribe = onSnapshot(
			query(
				collection(firestore, 'messages'),
				where('chatroomId', '==', chatroomId),
				orderBy('time', 'asc'),
			),
			snapshot => {
				const messageData = snapshot.docs.map(doc => ({
					id: doc.id,
					...doc.data(),
				}));
				setMessages(messageData);
			},
		);
		return unsubscribe;
	}, [chatroomId]);
	useEffect(() => {
		messagesContainerRef.current?.scrollTo({
			top: messagesContainerRef.current.scrollHeight,
			behavior: 'smooth',
		});
	}, [messages]);
	const sendMessage = async e => {
		const messageCollection = collection(firestore, 'messages');
		if (message.trim() === '' && !image) {
			return;
		}
		try {
			const messageData = {
				chatroomId,
				sender: me.id,
				content: message,
				time: serverTimestamp(),
				image: image,
				messageType: 'text',
			};
			await addDoc(messageCollection, messageData);
			setMessage('');
			setImage(null);
			const chatroomRef = doc(firestore, 'chatrooms', chatroomId);
			await updateDoc(chatroomRef, {
				lastMessage: message ? message : 'Image',
			});
		} catch (error) {
			console.log(error);
		}
	};
	if (!selectedChatroom) {
		return (
			<div className='flex flex-col items-center justify-center h-screen text-base-content/50'>
				<p className='text-lg'>Select a conversation to start chatting</p>
			</div>
		);
	}
	return (
		<div className='flex flex-col h-screen'>
			<div className='flex items-center gap-3 p-4 border-b border-base-300 bg-base-100'>
				<div className='avatar'>
					<div className='w-10 rounded-full'>
						<Image
							src={other.avatarUrl}
							alt={other.name}
							width={40}
							height={40}
						/>
					</div>
				</div>
				<h2 className='font-semibold'>{other.name}</h2>
			</div>
			<div ref={messagesContainerRef} className='flex-1 overflow-y-auto p-6'>
				{messages?.map(message => (
					<MessageCard
						key={message.id}
						message={message}
						me={me}
						other={other}
					/>
				))}
			</div>
			<MessageInput
				sendMessage={sendMessage}
				message={message}
				setMessage={setMessage}
				image={image}
				setImage={setImage}
			/>
		</div>
	);
}

export default ChatRoom;
