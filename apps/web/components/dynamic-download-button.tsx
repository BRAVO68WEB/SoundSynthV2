/* eslint-disable turbo/no-undeclared-env-vars */
'use client';

import { Button } from '@/components/ui/button';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Download, ChevronDown, FileText, FileBadge, AudioLines } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';

export function DynamicDownloadButton({ audioId }: Readonly<{ audioId: string }>) {
	const route = useRouter();

	const handleDownload = (format: string) => {
		toast('Downloading as ' + format + ' ...', {
			duration: 3000,
			icon: '👍',
			position: 'top-right',
			style: {
				background: '#4caf50',
				color: '#fff',
			},
		});

		if(format === 'PDF') {
			route.push(`${process.env.NEXT_PUBLIC_API_URL}/record/download/${audioId}/pdf`);
		} else if (format === 'Markdown') {
			route.push(`${process.env.NEXT_PUBLIC_API_URL}/record/download/${audioId}/text`);
		} else if (format === 'Original Audio') {
			route.push(`${process.env.NEXT_PUBLIC_API_URL}/record/download/${audioId}/audio`);
		}
	};

	return (
		<div className="flex items-center space-x-2">
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button variant="outline" className="ml-2">
						<Download className="mr-2 h-4 w-4" />
						Download
						<ChevronDown className="ml-2 h-4 w-4" />
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent>
					<DropdownMenuItem onClick={() => handleDownload('PDF')}>
						<FileBadge className="mr-2 h-4 w-4" />
						<span>as PDF</span>
					</DropdownMenuItem>
					<DropdownMenuItem onClick={() => handleDownload('Markdown')}>
						<FileText className="mr-2 h-4 w-4" />
						<span>as Markdown</span>
					</DropdownMenuItem>
					<DropdownMenuItem onClick={() => handleDownload('Plain Text')}>
						<AudioLines className="mr-2 h-4 w-4" />
						<span>Original Audio</span>
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		</div>
	);
}
