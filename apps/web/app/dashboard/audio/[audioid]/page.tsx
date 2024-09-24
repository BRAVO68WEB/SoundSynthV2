"use client";
import { AudioNoteDetail } from '@/components/audio-note-detail';
import { useParams } from 'next/navigation';

export default function Home() {
	const pathParms = useParams<{
		audioid: string;
	}>();

	return <AudioNoteDetail 
		audioId={pathParms.audioid}
	/>;
}
