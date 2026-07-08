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
		<div className='flex h-screen'>
			<div className='shrink-0 w-3/12'>
				<Users userData={user} />
			</div>
			<div className='grow w-3/12'>
				<ChatRoom user={user} />
			</div>
		</div>
	);
}
