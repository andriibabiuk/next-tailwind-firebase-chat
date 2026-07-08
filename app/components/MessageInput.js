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
		<div className='relative flex items-center gap-1 p-3 border-t border-base-300 bg-base-100'>
			<button
				type='button'
				onClick={() => document.getElementById('my_modal_3').showModal()}
				className={`btn btn-ghost btn-circle btn-sm ${image ? 'text-primary' : ''}`}
			>
				<FaPaperclip />
			</button>
			<button
				type='button'
				onClick={() => setShowEmojiPicker(!showEmojiPicker)}
				className={`btn btn-ghost btn-circle btn-sm ${showEmojiPicker ? 'text-primary' : ''}`}
			>
				😊
			</button>
			{showEmojiPicker && (
				<div className='absolute left-0 bottom-full mb-2 z-50 rounded-box shadow-xl overflow-hidden'>
					<EmojiPicker
						onEmojiClick={handleEmojiClick}
						autoFocusSearch={false}
					/>
				</div>
			)}
			<input
				type='text'
				placeholder='Type a message...'
				className='input input-bordered flex-1 rounded-full'
				value={message}
				onChange={e => setMessage(e.target.value)}
				onKeyDown={e => {
					if (e.key === 'Enter') {
						sendMessage();
					}
				}}
			/>
			<button
				type='button'
				onClick={() => sendMessage()}
				className='btn btn-primary btn-circle btn-sm'
			>
				<FaPaperPlane />
			</button>
			<dialog id='my_modal_3' className='modal'>
				<div className='modal-box'>
					<h3 className='font-semibold text-lg mb-4'>Send an image</h3>
					<form method='dialog'>
						{imagePreview && (
							// eslint-disable-next-line @next/next/no-img-element -- local blob preview of a selected file; next/image can't optimize a blob: URL
							<img
								src={imagePreview}
								alt='Selected image preview'
								className='max-h-60 w-60 mb-4 rounded-box object-cover'
							/>
						)}
						<input
							type='file'
							accept='image/*'
							onChange={handleFileChange}
							className='file-input file-input-bordered w-full mb-4'
						/>
						{uploadProgress && (
							<progress
								className='progress progress-primary w-full mb-4'
								value={uploadProgress}
								max='100'
							></progress>
						)}
						<div className='modal-action'>
							<button
								type='button'
								onClick={() => document.getElementById('my_modal_3').close()}
								className='btn btn-ghost'
							>
								Cancel
							</button>
							<button
								type='button'
								onClick={() => handleUpload()}
								className='btn btn-primary'
							>
								Upload
							</button>
						</div>
					</form>
				</div>
				<form method='dialog' className='modal-backdrop'>
					<button>close</button>
				</form>
			</dialog>
		</div>
	);
}

export default MessageInput;
