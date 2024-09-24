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
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { toast } from 'react-hot-toast';
import { Trash2, Share2, Link } from 'lucide-react';
import { ProjectActionsProps } from '@/types';
import { useRouter } from 'next/navigation';

export function DeleteProject({ projectId, projectName }: ProjectActionsProps) {
	const router = useRouter();
	const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

	const handleDelete = () => {
		setIsDeleteDialogOpen(false);

		// eslint-disable-next-line turbo/no-undeclared-env-vars
		fetch(`${process.env.NEXT_PUBLIC_API_URL}/record/${projectId}`, {
			method: 'DELETE',
			headers: {
				'Content-Type': 'application/json',
			},
			credentials: 'include',
		})
			.then((response) => response.json())
			.then(() => {
				toast(`${projectName} has been successfully deleted.`, {
					duration: 3000,
					icon: '🚮',
					position: 'top-right',
					style: {
						background: '#4caf50',
						color: '#fff',
					},
				});
			})
			.catch((err) => {
				console.error('Error:', err);
			})
			.finally(() => {
				router.push('/dashboard');
			});
	};

	return (
		<div className="flex items-center space-x-2">
			<Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
				<DialogTrigger asChild>
					<Button variant="destructive" size="sm">
						<Trash2 className="w-4 h-4 mr-2" />
						Delete
					</Button>
				</DialogTrigger>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Are you sure you want to delete this project?</DialogTitle>
						<DialogDescription>
							This action cannot be undone. This will permanently delete the project &quot;
							{projectName}&quot; and remove all of its data from our servers.
						</DialogDescription>
					</DialogHeader>
					<DialogFooter>
						<Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
							Cancel
						</Button>
						<Button variant="destructive" onClick={handleDelete}>
							Delete Project
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</div>
	);
}

export function ShareProject({ projectId, projectName }: ProjectActionsProps) {
	const handleShare = (method: string) => {
		if(method === 'link') {
			// eslint-disable-next-line turbo/no-undeclared-env-vars
			fetch(`${process.env.NEXT_PUBLIC_API_URL}/record/${projectId}`, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					is_public: true,
				}),
				credentials: 'include',
			})
				.then((response) => response.json())
				.then(() => {
					toast(`Link copied to clipboard!`, {
						duration: 3000,
						icon: '🔗',
						position: 'top-right',
						style: {
							background: '#4caf50',
							color: '#fff',
						},
					});
					navigator.clipboard.writeText(`${window.location.origin}/dashboard/audio/${projectId}?isPublic=true`);
				})
		}
	};

	return (
		<div className="flex items-center space-x-2">
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button variant="outline" size="sm">
						<Share2 className="w-4 h-4 mr-2" />
						Share
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent>
					<DropdownMenuItem onClick={() => handleShare('link')}>
						<Link className="w-4 h-4 mr-2" />
						Copy Link
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		</div>
	);
}

// export function DeleteShareProject({ projectId }: ProjectActionsProps) {
//   return (
//     <div className="flex items-center space-x-2">
//       <DropdownMenu>
//         <DropdownMenuTrigger asChild>
//           <Button variant="ghost" size="sm">
//             <MoreVertical className="w-4 h-4" />
//           </Button>
//         </DropdownMenuTrigger>
//         <DropdownMenuContent>
//           <DropdownMenuItem onClick={() => console.log(`Edit project: ${projectId}`)}>
//             Edit
//           </DropdownMenuItem>
//           <DropdownMenuItem onClick={() => console.log(`Duplicate project: ${projectId}`)}>
//             Duplicate
//           </DropdownMenuItem>
//           <DropdownMenuItem onClick={() => console.log(`Archive project: ${projectId}`)}>
//             Archive
//           </DropdownMenuItem>
//         </DropdownMenuContent>
//       </DropdownMenu>
//     </div>
//   )
// }
