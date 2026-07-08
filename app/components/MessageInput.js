import { app } from '@/lib/firebase';
import EmojiPicker from 'emoji-picker-react';
import {
	getDownloadURL,
	getStorage,
	ref,
	uploadBytesResumable,
} from 'firebase/storage';
import { useState } from 'react';
import { FaPaperclip, FaPaperPlane } from 'react-icons/fa';
function MessageInput({ sendMessage, message, setMessage, image, setImage }) {
	const storage = getStorage(app);
	const [file, setFile] = useState(null);
	const [uploadProgress, setUploadProgress] = useState(null);
	const [imagePreview, setImagePreview] = useState(null);
	const [showEmojiPicker, setShowEmojiPicker] = useState(false);
	const handleFileChange = e => {
		const file = e.target.files[0];
		if (file) {
			setFile(file);
			const reader = new FileReader();
			reader.onloadend = () => {
				setImagePreview(reader.result);
			};
			reader.readAsDataURL(file);
		}
	};
	const handleUpload = async () => {
		if (!file) {
			return;
		}
		const storageRef = ref(storage, `chatroom_images/${file.name}`);
		const uploadTask = uploadBytesResumable(storageRef, file);
		uploadTask.on(
			'state_changed',
			snapshot => {
				const progress =
					(snapshot.bytesTransferred / snapshot.totalBytes) * 100;
				setUploadProgress(progress);
			},
			error => {
				console.log(error);
			},
			() => {
				getDownloadURL(uploadTask.snapshot.ref).then(downloadURL => {
					setImage(downloadURL);
					setUploadProgress(null);
					setImagePreview(null);
					document.getElementById('my_modal_3').close();
				});
			},
		);
	};
	const handleEmojiClick = (emojiData, event) => {
		setMessage(prevMessage => prevMessage + emojiData.emoji);
	};
	return (
		<div className='relative flex items-center p-4 border-t border-gray-200'>
			<FaPaperclip
				onClick={() => document.getElementById('my_modal_3').showModal()}
				className={` ${image ? 'text-blue-500' : ' text-gray-500'} mr-2 cursor-pointer`}
			/>
			<button
				onClick={() => setShowEmojiPicker(!showEmojiPicker)}
				className={` ${image ? 'text-blue-500' : ' text-gray-500'} mr-2 cursor-pointer`}
			>
				😊
			</button>
			{showEmojiPicker && (
				<div className='absolute right-0 bottom-full p-2'>
					<EmojiPicker
						onEmojiClick={handleEmojiClick}
						autoFocusSearch={false}
					/>
				</div>
			)}
			<input
				type='text'
				placeholder='Type a message...'
				className='flex-1 border-none p-2 outline-none'
				value={message}
				onChange={e => setMessage(e.target.value)}
			/>
			<FaPaperPlane
				onClick={() => {
					sendMessage();
				}}
				className='text-gray-500 ml-2 cursor-pointer'
			/>
			<dialog id='my_modal_3' className='modal'>
				<div className='modal-box'>
					<form method='dialog'>
						{imagePreview && (
							// eslint-disable-next-line @next/next/no-img-element -- local blob preview of a selected file; next/image can't optimize a blob: URL
							<img
								src={imagePreview}
								alt='Selected image preview'
								className='max-h-60 w-60 mb-4'
							/>
						)}
						<input
							type='file'
							accept='image/*'
							onChange={handleFileChange}
							className='mb-4'
						/>
						<div
							onClick={() => {
								handleUpload();
							}}
							className='btn btn-sm btn-primary'
						>
							{' '}
							Upload
						</div>
						{uploadProgress && (
							<progress value={uploadProgress} max='100'></progress>
						)}
					</form>
					<button
						className='btn btn-sm btn-circle btn-ghost absolute right-2 top-2'
						onClick={() => document.getElementById('my_modal_3').close()}
					>
						x
					</button>
				</div>
			</dialog>
		</div>
	);
}

export default MessageInput;
