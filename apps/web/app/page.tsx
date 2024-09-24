'use client';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Mic, FileAudio, Edit, Download } from 'lucide-react';

export default function LandingPage() {
	
	return (
		<div className="flex flex-col min-h-screen">
			<header className="px-4 lg:px-6 h-14 flex items-center">
				<Link className="flex items-center justify-center" href="#">
					<Mic className="h-6 w-6 text-blue-600" />
					<span className="ml-2 text-2xl font-bold">SoundSynth</span>
				</Link>
				<nav className="ml-auto flex gap-4 sm:gap-6">
					<Button variant="outline" asChild>
						<Link href="#features">Features</Link>
					</Button>
					<Button variant="outline" asChild>
						<Link href="#about">About</Link>
					</Button>
					<Button variant="ghost" asChild className="text-white bg-black rounded-full">
						<Link 
							// eslint-disable-next-line turbo/no-undeclared-env-vars
							href={`${process.env.NEXT_PUBLIC_API_URL}` + '/auth/login'}
						>
							Login
						</Link>
					</Button>
				</nav>
			</header>
			<main className="flex flex-col align-center justify-center flex-1 self-center">
				<section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-gradient-to-tl from-slate-800 via-violet-500 to-zinc-400 rounded-md">
					<div className="container px-4 md:px-6">
						<div className="flex flex-col items-center space-y-4 text-center">
							<div className="space-y-2">
								<h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none text-white">
									Capture Your Thoughts with SoundSynth
								</h1>
								<p className="mx-auto max-w-[700px] text-white md:text-xl dark:text-white">
									Record, transcribe, and organize your ideas effortlessly. The smart way to manage
									your audio notes.
								</p>
							</div>
							<div className="w-full max-w-xl space-y-2">
								<Link 
									// eslint-disable-next-line turbo/no-undeclared-env-vars
									href={`${process.env.NEXT_PUBLIC_API_URL}` + '/auth/login'}
								>
									<Button className="h-10 w-72">Get Started</Button>
								</Link>
							</div>
						</div>
					</div>
				</section>
				<section id="features" className="w-full py-8 md:py-12 lg:py-16">
					<div className="container px-4 md:px-6">
						<h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12">
							Key Features
						</h2>
						<div className="grid gap-10 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 items-start justify-center">
							<div className="flex flex-col items-center space-y-2 border-gray-200 p-4 rounded-lg">
								<Mic className="h-8 w-8 text-blue-600" />
								<h3 className="font-bold">Audio Recording</h3>
								<p className="text-sm text-gray-500 text-center">
									High-quality audio capture with noise reduction.
								</p>
							</div>
							<div className="flex flex-col items-center space-y-2 border-gray-200 p-4 rounded-lg">
								<FileAudio className="h-8 w-8 text-blue-600" />
								<h3 className="font-bold">Transcription</h3>
								<p className="text-sm text-gray-500 text-center">
									Accurate speech-to-text conversion in multiple languages.
								</p>
							</div>
							<div className="flex flex-col items-center space-y-2 border-gray-200 p-4 rounded-lg">
								<Edit className="h-8 w-8 text-blue-600" />
								<h3 className="font-bold">Easy Editing</h3>
								<p className="text-sm text-gray-500 text-center">
									Edit and annotate your transcripts with ease.
								</p>
							</div>
							<div className="flex flex-col items-center space-y-2 border-gray-200 p-4 rounded-lg">
								<Download className="h-8 w-8 text-blue-600" />
								<h3 className="font-bold">Export Options</h3>
								<p className="text-sm text-gray-500 text-center">
									Download your notes in various formats.
								</p>
							</div>
						</div>
					</div>
				</section>
				<section id="about" className="w-full py-8 md:py-12 lg:py-16">
					<div className="container px-4 md:px-6">
						<h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12">
							About SoundSynth
						</h2>
						<div className="grid gap-10 sm:grid-cols-2 md:gap-16">
							<div className="space-y-4">
								<h3 className="text-xl font-bold">Our Mission</h3>
								<p className="text-gray-500 dark:text-gray-400">
									At SoundSynth, we're passionate about helping people capture and organize their
									thoughts effortlessly. Our mission is to provide a seamless audio note-taking
									experience that enhances productivity and creativity.
								</p>
							</div>
							<div className="space-y-4">
								<h3 className="text-xl font-bold">Why Choose Us</h3>
								<ul className="list-disc list-inside space-y-2 text-gray-500 dark:text-gray-400">
									<li>State-of-the-art speech recognition technology</li>
									<li>User-friendly interface designed for efficiency</li>
									<li>Robust organization tools for your notes</li>
								</ul>
							</div>
						</div>
					</div>
				</section>
			</main>
			<footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
				<p className="text-xs text-gray-500 dark:text-gray-400">© 2024 SoundSynth</p>
			</footer>
		</div>
	);
}
