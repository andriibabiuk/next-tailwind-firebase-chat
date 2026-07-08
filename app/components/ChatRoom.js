import MessageCard from './MessageCard';
import MessageInput from './MessageInput';
import { useState, useEffect, useRef } from 'react';
import { firestore } from '@/lib/firebase';
import {
	addDoc,
	collection,
	onSnapshot,
	orderBy,
	query,
	doc,
	serverTimestamp,
	where,
	updateDoc,
} from 'firebase/firestore';
function ChatRoom({ user, selectedChatroom }) {
	const me = selectedChatroom?.myData;
	const other = selectedChatroom?.otherData;
	const chatroomId = selectedChatroom?.id;
	const [message, setMessage] = useState('');
	const [messages, setMessages] = useState([]);
	const messagesContainerRef = useRef(null);
	const sendMessage = async e => {
		const messageCollection = collection(firestore, 'messages');
		if (message.trim() === '') {
			return;
		}
		try {
			const messageData = {
				chatroomId,
				sender: me.id,
				content: message,
				time: serverTimestamp(),
				image: '',
				messageType: 'text',
			};
			await addDoc(messageCollection, messageData);
			setMessage('');
			const chatroomRef = doc(firestore, 'chatrooms', chatroomId);
			await updateDoc(chatroomRef, {
				lastMessage: message,
			});
		} catch (error) {
			console.log(error);
		}
	};
	return (
		<div className='flex flex-col h-screen'>
			<div className='flex-1 overflow-y-auto p-10'>
				{messages?.map(message => (
					<MessageCard key={message.id} message={message} user={'test'} />
				))}
			</div>
			<MessageInput
				sendMessage={sendMessage}
				message={message}
				setMessage={setMessage}
			/>
		</div>
	);
}

export default ChatRoom;
