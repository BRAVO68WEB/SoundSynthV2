'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Cloud, Upload } from 'lucide-react';

export function FileUpload({
	setIsReadyToTranscribe,
	setFinalAudioBlob,
}: Readonly<{
	// eslint-disable-next-line no-unused-vars
	setIsReadyToTranscribe: (isReady: boolean) => void;
	// eslint-disable-next-line no-unused-vars
	setFinalAudioBlob: (blob: Blob) => void;
}>) {
	const [file, setFile] = useState<File | null>(null);

	const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		console.log('File changed:', event.target.files?.[0]);
		const selectedFile = event.target.files?.[0];
		if (selectedFile) {
			if (selectedFile.size <= 500 * 1024 * 1024) {
				// 500 MB in bytes
				setFile(selectedFile);
			} else {
				alert('File size exceeds 500 MB limit.');
			}
		}
	};

	const handleUpload = () => {
		console.log('Uploading file:', file);
		if (file) {
			let blob = new Blob([file], { type: file.type });
			setFinalAudioBlob(blob);
			setIsReadyToTranscribe(true);
		} else {
			alert('Please select a file to upload.');
		}
	};

	return (
		<div className="w-full max-w-md mx-auto space-y-6">
			<div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
				<Cloud className="mx-auto h-12 w-12 text-gray-400" />
				<Label htmlFor="file-upload" className="block mt-2">
					<Button variant="outline" onClick={() => document.getElementById('file-upload')?.click()}>
						Upload
					</Button>
					<Input
						id="file-upload"
						type="file"
						className="hidden"
						onChange={handleFileChange}
						accept=".mp3,.mp4,.m4a,.wav,.webm"
					/>
				</Label>
				<p className="mt-2 text-sm text-gray-500">mp3, mp4, m4a, wav, or webm files supported</p>
				<p className="text-sm text-gray-500">Max file size: 500 MB</p>
				{file && <p className="mt-2 text-sm text-blue-500">Selected file: {file.name}</p>}
				<Button className="mt-4" onClick={handleUpload}>
					<Upload className="mr-2 h-4 w-4" /> Upload File
				</Button>
			</div>
		</div>
	);
}
