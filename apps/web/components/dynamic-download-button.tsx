'use client';

import { Button } from '@/components/ui/button';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Download, ChevronDown, FileText, FileBadge } from 'lucide-react';
import { toast } from 'react-hot-toast';

export function DynamicDownloadButton({ audioId }: { audioId: string }) {
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
					<DropdownMenuItem onClick={() => handleDownload('Plain Text')}>
						<FileText className="mr-2 h-4 w-4" />
						<span>as Plain Text</span>
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		</div>
	);
}
