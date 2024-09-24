'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { FileText, Plus, LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { AudioRecorder } from './audio-record';
import { FileUpload } from './file-upload';
import { Dialog, DialogContent, DialogTitle, DialogHeader } from './ui/dialog';
import PageLoading from './loading';

export function AudioTranscription() {
	const [mode, setMode] = useState('record');
	const [isReadyToTranscribe, setIsReadyToTranscribe] = useState(false);
	const [finalAudioBlob, setFinalAudioBlob] = useState<Blob | null>(null);
	const [showProjectNameInput, setShowProjectNameInput] = useState(false);
	const [audioId, setAudioId] = useState<string | null>(null);
	const [projectName, setProjectName] = useState<string | null>(null);
	const [isLoading, setIsLoading] = useState(false);

	const router = useRouter();

	useEffect(() => {
		if (isReadyToTranscribe && finalAudioBlob) {
			setIsLoading(true);
			const formData = new FormData();
			formData.append('file', finalAudioBlob);
			// eslint-disable-next-line turbo/no-undeclared-env-vars
			fetch(`${process.env.NEXT_PUBLIC_API_URL}/upload/new`, {
				method: 'PUT',
				body: formData,
				credentials: 'include',
			})
				.then(response => response.json())
				.then(data => {
					console.log('data:', data);
					setAudioId(data._id);
					setShowProjectNameInput(true);
				})
				.catch(err => {
					console.error('Error:', err);
				}).finally(() => {
					setIsLoading(false);
				});
		}
	}, [isReadyToTranscribe, mode]);

	const handleProjectNameSubmit = () => {
		setShowProjectNameInput(false);
		setIsLoading(true);
		// eslint-disable-next-line turbo/no-undeclared-env-vars
		fetch(`${process.env.NEXT_PUBLIC_API_URL}/record`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				title: projectName,
				audio_id: audioId,
			}),
			credentials: 'include',
		})
			.then(response => response.json())
			.then(data => {
				setIsLoading(false);
				router.push(`/dashboard/audio/${data._id}`);
			})
			.catch(err => {
				console.error('Error:', err);
			})
			.finally(() => {
				setIsLoading(false);
			});
	};

	if (isLoading) {
		return <PageLoading />;
	}

	return (
		<>
			<div className="flex h-screen bg-gray-100">
				{/* Left Sidebar */}
				<div className="w-16 bg-white p-4 flex flex-col items-center space-y-6">
					<div className="w-10 h-10 bg-red-500 rounded-lg flex items-center justify-center">
						<Link href="/dashboard/transcribe">
							<Plus className="text-white" />
						</Link>
					</div>
					<Link href="/dashboard">
						<FileText className="text-gray-400" />
					</Link>
					<Link href="/api/logout">
						<LogOut className="text-gray-400" />
					</Link>
				</div>

				{/* Main Content */}
				<div className="flex-1 p-8">
					<Card className="max-w-2xl mx-auto p-8">
						<h2 className="text-2xl font-semibold text-center mb-8">
							Jyotirmoy, Let's create Simple Summary
						</h2>

						<div className="flex justify-center mb-8">
							{mode === 'record' ? (
								<AudioRecorder
									setIsReadyToTranscribe={setIsReadyToTranscribe}
									setFinalAudioBlob={setFinalAudioBlob}
								/>
							) : (
								<FileUpload
									setIsReadyToTranscribe={setIsReadyToTranscribe}
									setFinalAudioBlob={setFinalAudioBlob}
								/>
							)}
						</div>

						<div className="flex justify-center space-x-4">
							<Button 
								variant={`${
									mode === 'record' ? 'default' : 'outline'
								}`}
								className={`${
									mode === 'record' ? 'bg-red-500 text-white' : 'bg-white text-gray-700'
								}`}
								onClick={() => setMode('record')}
							>
								Record Audio
							</Button>
							<Button
								variant={`${
									mode === 'upload' ? 'default' : 'outline'
								}`}
								className={`${
									mode === 'upload' ? 'bg-red-500 text-white' : 'bg-white text-gray-700'
								}`}
								onClick={() => setMode('upload')}
							>
								Upload Audio
							</Button>
						</div>
					</Card>
				</div>
			</div>
			<Dialog open={showProjectNameInput} onOpenChange={(val) => {
				if(val){
					setShowProjectNameInput(true)
				}
				setIsReadyToTranscribe(false)
				setFinalAudioBlob(null)
				setShowProjectNameInput(false)
			}}>
				<DialogContent className="bg-white p-8 rounded-lg shadow-lg">
					<DialogHeader className="text-2xl font-bold mb-4">
						<DialogTitle>Create a New Project</DialogTitle>
					</DialogHeader>
					<div className="flex flex-col space-y-4">
						<div className="flex flex-col space-y-2">
							<label htmlFor="projectName" className="text-sm font-medium text-gray-700">
								Project Name
							</label>
							<input
								type="text"
								id="projectName"
								className="border border-gray-300 rounded-md p-2 focus:outline-none focus:border-blue-500"
								value={projectName || ''}
								onChange={e => setProjectName(e.target.value)}
							/>
						</div>
						<div className="flex flex-col space-y-2">
							<button
								className="bg-blue-500 text-white rounded-md p-2 hover:bg-blue-600"
								onClick={() => {
									handleProjectNameSubmit();
								}}
							>
								Create
							</button>
						</div>
					</div>
				</DialogContent>
			</Dialog>
		</>
	);
}
