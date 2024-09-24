'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileText, Search, Plus, MoreHorizontal, LogOut } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import PageLoading from './loading';

interface IAudioNote {
	id: number;
	title: string;
	date: string;
	transcription: string;
}

export function NotesDashboard() {
	const [audioNotes, setAudioNotes] = useState<IAudioNote[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [originalAudioNotes, setOriginalAudioNotes] = useState<IAudioNote[]>([]);

	const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
		const searchTerm = e.target.value.toLowerCase();
		const filteredNotes = originalAudioNotes.filter((note) =>
			note.title.toLowerCase().includes(searchTerm) || note.transcription.toLowerCase().includes(searchTerm)
		);
		setAudioNotes(filteredNotes);
	};

	useEffect(() => {
		// eslint-disable-next-line turbo/no-undeclared-env-vars
		fetch(process.env.NEXT_PUBLIC_API_URL + '/record', {
			credentials: 'include',
		})
		.then((res) => res.json())
		.then(({data}) => {
			let audioNotes = data.map((note: any) => ({
				id: note.id,
				title: note.title,
				date: note.created_at,
				transcription: note.transcription,
			}));
			setAudioNotes(audioNotes);
			setOriginalAudioNotes(audioNotes);
			setIsLoading(false);
		});
	}, []);

	if (isLoading) {
		return <PageLoading />;
	}
	
	return (
		<div className="flex h-screen bg-gray-100">
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
				<Link href="/api/auth/logout">
					<LogOut className="text-gray-400" />
				</Link>
			</div>

			{/* Main Content */}
			<div className="flex-1 p-8">
				<div className="max-w-4xl mx-auto">
					<div className="mb-8 relative">
						<Input 
							type="text"
							placeholder="Search notes..."
							className="pl-10"
							onChange={handleSearch}
						/>
						<Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
					</div>

					<div>
						<h2 className="text-sm font-semibold mb-2">Notes</h2>

						{audioNotes.map(note => (
							<Card key={note.id} className="p-6 mb-4">
								<div className="flex justify-between items-start mb-4">
									<div>
										<Link
											href={`/dashboard/audio/${note.id}`}
											className="flex items-center space-x-2"
										>
											<h3 className="text-lg font-semibold">{note.title}</h3>
										</Link>
										<p className="text-sm text-gray-500">
											{new Date(note.date).toUTCString()}
										</p>
									</div>
								</div>
								<Tabs defaultValue="summary">
									<TabsList>
										<TabsTrigger value="transcript">Show Transcript</TabsTrigger>
									</TabsList>
									<TabsContent value="transcript" className="mt-4">
										<p className="text-sm text-gray-700">{note.transcription}</p>
									</TabsContent>
								</Tabs>
							</Card>
						))}
					</div>
				</div>
			</div>
		</div>
	);
}
