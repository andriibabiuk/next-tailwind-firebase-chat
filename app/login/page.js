'use client';
import { auth } from '@/lib/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

function Page() {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [errors, setErrors] = useState({});
	const [loading, setLoading] = useState(false);
	const router = useRouter();

	const validateForm = () => {
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		const newErrors = {};
		if (!email.trim() || !emailRegex.test(email)) {
			newErrors.email = 'Email is invalid!';
		}
		if (password.length <= 6) {
			newErrors.password = 'Password must be at least 6 characters long';
		}
		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};
	const handleSubmit = async e => {
		e.preventDefault();
		setLoading(true);
		try {
			if (!validateForm()) {
				setLoading(false);
				return;
			}
			const userCredential = await signInWithEmailAndPassword(
				auth,
				email,
				password,
			);
			const user = userCredential.user;
			if (user) {
				router.push('/');
			}
			setErrors({});
		} catch (error) {
			console.log(error);
		} finally {
			setLoading(false);
		}
	};
	return (
		<div className='flex justify-center items-center h-screen p-10 m-2'>
			<form
				onSubmit={handleSubmit}
				className='space-y-4 w-full max-w-2xl shadow-lg p-10'
			>
				<h1 className='text-xl text-center font-semibold text-[#0b3a65ff]'>
					Chat<span className='font-bold text-[#eeab63ff]'>2</span>Chat
				</h1>

				<div>
					<label className='label'>
						<span className='label-text'>Email</span>
					</label>
					<input
						type='text'
						placeholder='Enter your email'
						value={email}
						onChange={e => setEmail(e.target.value)}
						className='input input-bordered w-full'
					/>
					{errors.email && (
						<span className='text-sm text-red-500'>{errors.email}</span>
					)}
				</div>
				<div>
					<label className='label'>
						<span className='label-text'>Password</span>
					</label>
					<input
						type='password'
						placeholder='Enter your password'
						value={password}
						onChange={e => setPassword(e.target.value)}
						className='input input-bordered w-full'
					/>
					{errors.password && (
						<span className='text-sm text-red-500'>{errors.password}</span>
					)}
				</div>

				<div>
					<button
						className='btn btn-block bg-[#0b3a65ff] text-white'
						disabled={loading}
						type='submit'
					>
						{loading ? (
							<span className='loading loading-spinner loading-sm'></span>
						) : (
							'Login'
						)}
					</button>
				</div>
				<span>
					Don&apos;t have an Account?{' '}
					<Link
						href='/register'
						className='text-blue-600 hover:text-blue-800 hover:underline'
					>
						Register
					</Link>
				</span>
			</form>
		</div>
	);
}

export default Page;
