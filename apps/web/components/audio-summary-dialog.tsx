'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'react-hot-toast';
import { Save, FileText } from 'lucide-react';

export function AudioSummaryDialog({
	audioId,
	audioSummary,
	setAudioSummary
}: Readonly<{
	audioId: string;
	audioSummary: string;
	setAudioSummary: (summary: string) => void;
}>) {
	const [isOpen, setIsOpen] = useState(false);
	const [summary, setSummary] = useState(audioSummary);
	const [isEditing, setIsEditing] = useState(false);
	const [editedSummary, setEditedSummary] = useState(summary);

	const handleEdit = () => {
		setIsEditing(true);
		setEditedSummary(summary);
	};

	const handleSave = () => {
		setSummary(editedSummary);
		setIsEditing(false);

		// eslint-disable-next-line turbo/no-undeclared-env-vars
		fetch(`${process.env.NEXT_PUBLIC_API_URL}/record/${audioId}`, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				summary: editedSummary,
			}),
			credentials: 'include',
		})
			.then((response) => response.json())
			.then(() => {
				setIsOpen(false);
				setSummary(editedSummary);
				setAudioSummary(editedSummary);
			})
			.catch((err) => {
				console.error('Error:', err);
			})
			.finally(() => {
				toast('Your changes have been saved successfully.', {
					duration: 3000,
					icon: '👍',
					position: 'top-right',
					style: {
						background: '#4caf50',
						color: '#fff',
					},
				});
			});
	};

	const handleCancel = () => {
		setIsEditing(false);
		setEditedSummary(summary);
	};

	return (
		<Dialog open={isOpen} onOpenChange={setIsOpen}>
			<DialogTrigger asChild>
				<Button variant="outline">
					<FileText className="w-4 h-4 mr-2" />
					Modify Summary
				</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-[425px] max-h-[90vh] overflow-y-auto">
				<DialogHeader>
					<DialogTitle>Audio Summary</DialogTitle>
					<DialogDescription>View and edit the summary of your audio recording.</DialogDescription>
				</DialogHeader>
				<div className="py-4">
					{isEditing ? (
						<Textarea
							value={editedSummary}
							onChange={e => setEditedSummary(e.target.value)}
							rows={6}
							placeholder="Edit your summary here..."
							className="w-full resize-none"
						/>
					) : (
						<p className="text-sm text-gray-700">{summary}</p>
					)}
				</div>
				<DialogFooter>
					{isEditing ? (
						<>
							<Button variant="outline" onClick={handleCancel}>
								Cancel
							</Button>
							<Button onClick={handleSave}>
								<Save className="w-4 h-4 mr-2" />
								Save Changes
							</Button>
						</>
					) : (
						<Button onClick={handleEdit}>Edit Summary</Button>
					)}
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
