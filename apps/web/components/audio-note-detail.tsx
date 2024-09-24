'use client';

import { Card } from '@/components/ui/card';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileText, Play, StopCircle, Plus, LogOut } from 'lucide-react';
import { AudioSummaryDialog } from './audio-summary-dialog';
import { DynamicDownloadButton } from './dynamic-download-button';
import { DeleteProject, ShareProject } from './delete-share-project';
import PageLoading from './loading';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm'
import { type ISAudioNote } from '@/types';

export function AudioNoteDetail({
	audioId
} : Readonly<{
	audioId: string,
}>) {
	const [audioNote, setAudioNote] = useState<ISAudioNote | null>(null);
	const [audioSummary, setAudioSummary] = useState<string>('');
	const [isPlaying, setIsPlaying] = useState(false);
	const [playAudio, setPlayAudio] = useState(false);
	const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		// eslint-disable-next-line turbo/no-undeclared-env-vars
		fetch(`${process.env.NEXT_PUBLIC_API_URL}/record/${audioId}`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
			},
			credentials: 'include',
		})
			.then((response) => response.json())
			.then((data) => {
				const audioNote: ISAudioNote = {
					id: data.record.id,
					title: data.record.title,
					date: data.record.created_at,
					summary: data.record.summary,
					transcription: data.record.transcription,
					audioUrl: data.audio.url,
				};
				setAudioSummary(data.record.summary);
				setAudioNote(audioNote);
				setIsLoading(false);
			});
	}, []);

	useEffect(() => {
		if (playAudio && audioNote) {
			const audioElement = new Audio(audioNote.audioUrl);
			audioElement.play();
			setAudio(audioElement);
			setIsPlaying(true);
		}
		return () => {
			if (audio) {
				audio.pause();
				audio.currentTime = 0;
			}
		};
	}, [playAudio, audioNote]);

	useEffect(() => {
		if (audioNote && audioSummary) {
			const newAudioNote = {
				...audioNote,
				summary: audioSummary,
			};
			setAudioNote(newAudioNote)
		}
	}, [audioSummary]);

	if (isLoading) {
		return <PageLoading />;
	}

	return (
		audioNote && audioSummary && (
			<div className="flex h-screen bg-gray-100 overflow-hidden">
				{/* Left Sidebar */}
				<div className="w-16 bg-white p-4 flex flex-col items-center space-y-6">
					<Link href="/dashboard/transcribe">
						<Plus className="text-gray-400" />
					</Link>
					<div className="w-10 h-10 bg-red-500 rounded-lg flex items-center justify-center">
						<Link href="/dashboard">
							<FileText className="text-white" />
						</Link>
					</div>
					<Link href="/api/logout">
						<LogOut className="text-gray-400" />
					</Link>
				</div>

				<div className="flex-1 p-8 h-screen overflow-y-auto">
					<div className="max-w-4xl mx-auto">
						<Card className="p-6">
							<div className="flex justify-between items-start mb-4">
								<div>
									<h2 className="text-2xl font-semibold flex items-center">
										{audioNote.title}
										{isPlaying ? (
											<StopCircle
												className="ml-2 cursor-pointer"
												onClick={() => {
													setIsPlaying(false);
													setPlayAudio(false);
													if (audio) {
														audio.pause();
														audio.currentTime = 0;
													}
												}}
											/>
										) : (
											<Play
												className="ml-2 cursor-pointer"
												onClick={() => {
													setIsPlaying(true);
													setPlayAudio(true);
												}}
											/>
										)}
									</h2>
									<p className="text-sm text-gray-500">{audioNote.date}</p>
								</div>
							</div>

							<Tabs defaultValue="summary">
								<TabsList>
									<TabsTrigger value="summary">Summary</TabsTrigger>
									<TabsTrigger value="transcript">Transcript</TabsTrigger>
								</TabsList>
								<TabsContent value="summary">
									<p className="text-sm text-gray-700">
										<Markdown remarkPlugins={[remarkGfm]}>
											{audioNote.summary}
										</Markdown>
									</p>
								</TabsContent>
								<TabsContent value="transcript">
									<p className="text-sm text-gray-700">{audioNote.transcription}</p>
								</TabsContent>
							</Tabs>

							<div className="mt-4 flex justify-between items-center">
								<div className="flex space-x-2">
									<DeleteProject projectId={audioNote.id} projectName={audioNote.title} />
									<ShareProject projectId={audioNote.id} projectName={audioNote.title} />
								</div>
								<div className="flex space-x-2">
									<AudioSummaryDialog audioId={audioNote.id} audioSummary={audioSummary} setAudioSummary={setAudioSummary} />
									<DynamicDownloadButton audioId={audioNote.id} />
								</div>
							</div>
						</Card>
					</div>
				</div>
			</div>
		)
	);
}