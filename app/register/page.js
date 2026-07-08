'use client';
import { auth, firestore } from '@/lib/firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AvatarGenerator } from 'random-avatar-generator';
import { useEffect, useState } from 'react';
function generateNewAvatar() {
	const generator = new AvatarGenerator();
	return generator.generateRandomAvatar();
}
function Page() {
	const [name, setName] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');
	const [errors, setErrors] = useState({});
	const [loading, setLoading] = useState(false);
	const [avatarUrl, setAvatarUrl] = useState('');
	const router = useRouter();
	const handleRefreshAvatar = () => {
		setAvatarUrl(generateNewAvatar());
	};
	useEffect(() => {
		// eslint-disable-next-line react-hooks/set-state-in-effect -- avatar is random and must be generated client-only to avoid an SSR/hydration mismatch
		setAvatarUrl(generateNewAvatar());
	}, []);
	const validateForm = () => {
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		const newErrors = {};
		if (!name.trim()) {
			newErrors.name = 'Name is required';
		}
		if (!email.trim() || !emailRegex.test(email)) {
			newErrors.email = 'Email is invalid!';
		}
		if (password.length <= 6) {
			newErrors.password = 'Password must be at least 6 characters long';
		}
		if (password !== confirmPassword) {
			newErrors.confirmPassword = 'Passwords do not match';
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
			const userCredential = await createUserWithEmailAndPassword(
				auth,
				email,
				password,
			);
			const user = userCredential.user;
			const docRef = doc(firestore, 'users', user.uid);
			await setDoc(docRef, {
				name,
				email,
				avatarUrl,
			});
			router.push('/');
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
					<div className='flex flex-col items-center gap-3 bg-base-200 rounded-box p-4'>
						{avatarUrl && (
							<div className='avatar'>
								<div className='w-20 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2'>
									<Image
										src={avatarUrl}
										width={80}
										height={80}
										alt='avatar'
									/>
								</div>
							</div>
						)}
						<button
							type='button'
							className='btn btn-outline btn-primary btn-sm'
							onClick={handleRefreshAvatar}
						>
							New Avatar
						</button>
					</div>
					<fieldset className='fieldset'>
						<label className='label'>Name</label>
						<input
							type='text'
							placeholder='Enter your name'
							value={name}
							onChange={e => setName(e.target.value)}
							className={`input input-bordered w-full ${errors.name ? 'input-error' : ''}`}
						/>
						{errors.name && (
							<span className='text-sm text-error'>{errors.name}</span>
						)}
					</fieldset>
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
					<fieldset className='fieldset'>
						<label className='label'>Confirm Password</label>
						<input
							type='password'
							placeholder='Confirm your password'
							value={confirmPassword}
							onChange={e => setConfirmPassword(e.target.value)}
							className={`input input-bordered w-full ${errors.confirmPassword ? 'input-error' : ''}`}
						/>
						{errors.confirmPassword && (
							<span className='text-sm text-error'>
								{errors.confirmPassword}
							</span>
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
							'Register'
						)}
					</button>
					<span className='text-center text-sm'>
						Already have an Account?{' '}
						<Link href='/login' className='link link-primary'>
							Login
						</Link>
					</span>
				</div>
			</form>
		</div>
	);
}

export default Page;
