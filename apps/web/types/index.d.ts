export interface IUser {
    id: string;
    email: string;
    username: string;
}

export interface ISAudioNote {
	id: string;
	title: string;
	date: string;
	summary: string;
	transcription: string;
	audioUrl: string;
}

export interface IAudioNote {
	id: number;
	title: string;
	date: string;
	transcription: string;
}
export interface ProjectActionsProps {
	projectId: string;
	projectName: string;
}