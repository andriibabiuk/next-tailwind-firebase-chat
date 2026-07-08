'use client';
import { app, firestore } from '@/lib/firebase';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import ChatRoom from './components/ChatRoom';
import Users from './components/Users';

export default function Home() {
	const auth = getAuth(app);
	const [user, setUser] = useState(null);
	const router = useRouter();
	const [selectedChatroom, setSelectedChatroom] = useState(null);

	useEffect(() => {
		const unsubscribe = onAuthStateChanged(auth, async user => {
			if (user) {
				const userRef = doc(firestore, 'users', user.uid);
				const userSnap = await getDoc(userRef);
				const userData = { id: userSnap.id, ...userSnap.data() };
				setUser(userData);
			} else {
				setUser(null);
				router.push('/login');
			}
		});
		return () => unsubscribe();
	}, [auth, router]);
	return (
		<div className='flex h-screen bg-base-200'>
			<div className='w-80 shrink-0 border-r border-base-300 bg-base-100'>
				<Users userData={user} setSelectedChatroom={setSelectedChatroom} />
			</div>
			<div className='flex-1'>
				<ChatRoom user={user} selectedChatroom={selectedChatroom} />
			</div>
		</div>
	);
}
