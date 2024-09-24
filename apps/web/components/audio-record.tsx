'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Mic, Square, Play, Save } from 'lucide-react';

export function AudioRecorder({
	setIsReadyToTranscribe,
	setFinalAudioBlob,
}: Readonly<{
	setIsReadyToTranscribe: (_isReady: boolean) => void;
	setFinalAudioBlob: (_audioBlob: Blob) => void;
}>) {
	const [isRecording, setIsRecording] = useState(false);
	const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
	const [isPlaying, setIsPlaying] = useState(false);
	const mediaRecorderRef = useRef<MediaRecorder | null>(null);
	const audioChunksRef = useRef<Blob[]>([]);
	const audioPlayerRef = useRef<HTMLAudioElement | null>(null);

	useEffect(() => {
		if (audioBlob) {
			const audioUrl = URL.createObjectURL(audioBlob);
			if (audioPlayerRef.current) {
				audioPlayerRef.current.src = audioUrl;
			}
		}
	}, [audioBlob]);

	const startRecording = async () => {
		try {
			const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
			mediaRecorderRef.current = new MediaRecorder(stream);
			mediaRecorderRef.current.ondataavailable = event => {
				audioChunksRef.current.push(event.data);
			};
			mediaRecorderRef.current.onstop = () => {
				const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
				setAudioBlob(audioBlob);
				audioChunksRef.current = [];
			};
			mediaRecorderRef.current.start();
			setIsRecording(true);
		} catch (error) {
			console.error('Error accessing microphone:', error);
		}
	};

	const stopRecording = () => {
		if (mediaRecorderRef.current && isRecording) {
			mediaRecorderRef.current.stop();
			setIsRecording(false);
		}
	};

	const playAudio = () => {
		if (audioPlayerRef.current) {
			audioPlayerRef.current.play();
			setIsPlaying(true);
		}
	};

	const pauseAudio = () => {
		if (audioPlayerRef.current) {
			audioPlayerRef.current.pause();
			setIsPlaying(false);
		}
	};

	const saveAudio = () => {
		if (audioBlob) {
			setIsReadyToTranscribe(true);
			setFinalAudioBlob(audioBlob);
		}
	};

	return (
		<Card className="w-full max-w-md mx-auto">
			<CardHeader>
				<CardTitle>Audio Recorder</CardTitle>
			</CardHeader>
			<CardContent className="flex justify-center">
				<Button
					variant={isRecording ? 'destructive' : 'default'}
					size="lg"
					onClick={isRecording ? stopRecording : startRecording}
				>
					{isRecording ? <Square className="mr-2" /> : <Mic className="mr-2" />}
					{isRecording ? 'Stop Recording' : 'Start Recording'}
				</Button>
			</CardContent>
			<CardFooter className="flex justify-between">
				<Button
					variant="outline"
					onClick={isPlaying ? pauseAudio : playAudio}
					disabled={!audioBlob}
				>
					<Play className="mr-2" />
					{isPlaying ? 'Pause' : 'Play'}
				</Button>
				<Button variant="outline" onClick={saveAudio} disabled={!audioBlob}>
					<Save className="mr-2" />
					Save Recording
				</Button>
			</CardFooter>
			<audio ref={audioPlayerRef} onEnded={() => setIsPlaying(false)} />
		</Card>
	);
}
