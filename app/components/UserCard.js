import Image from 'next/image';

function UserCard({ name, avatarUrl, latestMessageText, time }) {
	return (
		<div className='flex items-center p-3 gap-3'>
			<div className='avatar shrink-0'>
				<div className='w-12 rounded-full'>
					<Image src={avatarUrl} alt='avatar' width={48} height={48} />
				</div>
			</div>
			<div className='flex-1 min-w-0'>
				<div className='flex items-center justify-between gap-2'>
					<h2 className='text-base font-semibold truncate'>{name}</h2>
					{time && (
						<span className='text-xs text-base-content/50 shrink-0'>
							{time}
						</span>
					)}
				</div>
				{latestMessageText && (
					<p className='text-sm text-base-content/60 truncate'>
						{latestMessageText}
					</p>
				)}
			</div>
		</div>
	);
}

export default UserCard;
