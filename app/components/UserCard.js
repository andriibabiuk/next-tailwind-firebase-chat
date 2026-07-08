import Image from 'next/image';

function UserCard({ name, avatarUrl, latestMessageText, time, type }) {
	return (
		<div className='flex items-center p-4 border-b border-gray-200 relative hover:cursor-pointer'>
			<div className='shrink-0 mr-4 relative'>
				<div className='w-12 h-12 rounded-full overflow-hidden'>
					<Image
						src={avatarUrl}
						alt='avatar'
						width={48}
						height={48}
						className='w-full h-full object-cover'
					/>
				</div>
			</div>
			{type === 'chat' && (
				<>
					<div className='flex-1'>
						<div className='flex items-center justify-between'>
							<h2 className='text-base font-semibold'>{name}</h2>
							<span className='text-xs text-gray-500'>{time}</span>
						</div>
						<p className='text-sm text-gray-500 truncate'>
							{latestMessageText}
						</p>
					</div>
				</>
			)}
			{type === 'users' && (
				<>
					<div className='flex-1'>
						<div className='flex items-center justify-between'>
							<h2 className='text-base font-semibold'>{name}</h2>
						</div>
					</div>
				</>
			)}
		</div>
	);
}

export default UserCard;
