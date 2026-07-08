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
		<div className='flex justify-center items-center min-h-screen bg-base-200 p-4'>
			<form
				onSubmit={handleSubmit}
				className='card w-full max-w-md bg-base-100 shadow-xl'
			>
				<div className='card-body space-y-4'>
					<h1 className='text-2xl text-center font-semibold'>
						<span className='text-primary'>Chat</span>
						<span className='font-bold text-secondary'>2</span>
						<span className='text-primary'>Chat</span>
					</h1>

					<fieldset className='fieldset'>
						<label className='label'>Email</label>
						<input
							type='text'
							placeholder='Enter your email'
							value={email}
							onChange={e => setEmail(e.target.value)}
							className={`input input-bordered w-full ${errors.email ? 'input-error' : ''}`}
						/>
						{errors.email && (
							<span className='text-sm text-error'>{errors.email}</span>
						)}
					</fieldset>
					<fieldset className='fieldset'>
						<label className='label'>Password</label>
						<input
							type='password'
							placeholder='Enter your password'
							value={password}
							onChange={e => setPassword(e.target.value)}
							className={`input input-bordered w-full ${errors.password ? 'input-error' : ''}`}
						/>
						{errors.password && (
							<span className='text-sm text-error'>{errors.password}</span>
						)}
					</fieldset>

					<button
						className='btn btn-primary btn-block'
						disabled={loading}
						type='submit'
					>
						{loading ? (
							<span className='loading loading-spinner loading-sm'></span>
						) : (
							'Login'
						)}
					</button>
					<span className='text-center text-sm'>
						Don&apos;t have an Account?{' '}
						<Link href='/register' className='link link-primary'>
							Register
						</Link>
					</span>
				</div>
			</form>
		</div>
	);
}

export default Page;
