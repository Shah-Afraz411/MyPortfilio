"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import Lenis from "@studio-freight/lenis";
import { ChatbotCard } from "@/components/cards/chatbot-card";
import { ProjectsCard } from "@/components/cards/projects-card";
import { SkillsCard } from "@/components/cards/skills-card";
import { ExperienceCard } from "@/components/cards/experience-card";
import { ThemeToggle } from "@/components/theme-toggle";
import { Download, Github, Linkedin } from "lucide-react";
import { SiPython, SiMongodb, SiFastapi, SiTensorflow, SiPytorch } from "react-icons/si";
import { TbBrain, TbSql, TbSparkles, TbRobot } from "react-icons/tb";

type CardType = "chatbot" | "projects" | "skills" | "experience" | null;

const cards = [
	{ id: "hero", label: "Home" },
	{ id: "chatbot", label: "AI Assistant" },
	{ id: "projects", label: "Projects" },
	{ id: "skills", label: "Skills" },
	{ id: "experience", label: "Experience" },
];

function ProgressIndicator({
	progress,
}: {
	progress: number;
}) {
	return (
		<div className="relative w-48">
			<div className="w-full h-1 bg-border rounded-full overflow-hidden">
				<div
					className="h-full bg-foreground transition-none origin-left"
					style={{ transform: `scaleX(${progress})` }}
				/>
			</div>
			<div
				className="absolute -top-1 left-0 w-3 h-3 bg-foreground rounded-full"
				style={{
					transform: `translateX(${progress * 192 - 6}px)`,
				}}
			/>
		</div>
	);
}

export default function Home() {
	const [activeCard, setActiveCard] = useState<CardType>(null);
	const [mounted, setMounted] = useState(false);
	const [scrollProgress, setScrollProgress] = useState(0);
	const containerRef = useRef<HTMLDivElement>(null);
	const lenisRef = useRef<Lenis | null>(null);
	const rafRef = useRef<number | null>(null);

	// Optimized cursor with reduced spring
	const cursorX = useMotionValue(0);
	const cursorY = useMotionValue(0);
	const cursorXSpring = useSpring(cursorX, { damping: 30, stiffness: 150, mass: 0.5 });
	const cursorYSpring = useSpring(cursorY, { damping: 30, stiffness: 150, mass: 0.5 });

	useEffect(() => {
		setMounted(true);
	}, []);

	// Lenis smooth scroll - SIMPLIFIED
	useEffect(() => {
		if (!mounted || activeCard) {
			if (lenisRef.current) {
				lenisRef.current.destroy();
				lenisRef.current = null;
			}
			if (rafRef.current) {
				cancelAnimationFrame(rafRef.current);
				rafRef.current = null;
			}
			return;
		}

		const container = containerRef.current;
		if (!container) return;

		const lenis = new Lenis({
			wrapper: container,
			content: container.querySelector(".scroll-content") as HTMLElement,
			orientation: "horizontal",
			gestureOrientation: "both",
			smoothWheel: true,
			wheelMultiplier: 1,
			touchMultiplier: 2,
			duration: 1.2,
			easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
		});

		lenisRef.current = lenis;

		function raf(time: number) {
			lenis.raf(time);
			rafRef.current = requestAnimationFrame(raf);
		}

		rafRef.current = requestAnimationFrame(raf);

		return () => {
			lenis.destroy();
			if (rafRef.current) cancelAnimationFrame(rafRef.current);
		};
	}, [mounted, activeCard]);

	// Combined smooth zoom and scroll tracking - OPTIMIZED
	useEffect(() => {
		if (!mounted || activeCard) return;
		
		const container = containerRef.current;
		if (!container) return;

		let ticking = false;

		const updateScrollAndZoom = () => {
			const scrollLeft = container.scrollLeft;
			const maxScroll = container.scrollWidth - container.clientWidth;
			const progress = maxScroll > 0 ? scrollLeft / maxScroll : 0;
			
			setScrollProgress(progress);
			ticking = false;
		};

		const handleScroll = () => {
			if (!ticking) {
				requestAnimationFrame(updateScrollAndZoom);
				ticking = true;
			}
		};

		container.addEventListener('scroll', handleScroll, { passive: true });
		updateScrollAndZoom();
		
		return () => {
			container.removeEventListener('scroll', handleScroll);
		};
	}, [mounted, activeCard]);

	// Throttled cursor movement
	useEffect(() => {
		if (!mounted) return;
		
		let lastCursorUpdate = 0;
		
		const moveCursor = (e: MouseEvent) => {
			const now = performance.now();
			if (now - lastCursorUpdate > 16) { // ~60fps
				cursorX.set(e.clientX);
				cursorY.set(e.clientY);
				lastCursorUpdate = now;
			}
		};

		window.addEventListener("mousemove", moveCursor, { passive: true });
		return () => window.removeEventListener("mousemove", moveCursor);
	}, [mounted, cursorX, cursorY]);

	// Enhanced back click with zoom reset
	const handleBackClick = useCallback(() => {
		const container = containerRef.current;
		if (container) {
			container.scrollLeft = 0;
			setScrollProgress(0);
		}
		setActiveCard(null);
	}, []);

	// Download CV handler
	const handleDownloadCV = async (e: React.MouseEvent) => {
		e.preventDefault();
		e.stopPropagation();
		
		try {
			const apiUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';
			console.log('Fetching CV from:', `${apiUrl}/api/download-cv`);
			
			const response = await fetch(`${apiUrl}/api/download-cv`, {
				method: 'GET',
				headers: {
					'Accept': 'application/pdf',
				},
			});
			
			console.log('Response status:', response.status);
			
			if (!response.ok) {
				const contentType = response.headers.get('content-type');
				let errorMessage = `Failed to download CV: ${response.status}`;
				
				if (contentType?.includes('application/json')) {
					const errorData = await response.json();
					errorMessage = errorData.detail || errorMessage;
				}
				
				console.error('Download failed:', errorMessage);
				throw new Error(errorMessage);
			}

			const blob = await response.blob();
			console.log('Blob size:', blob.size, 'bytes');
			
			const url = window.URL.createObjectURL(blob);
			const a = document.createElement('a');
			a.href = url;
			a.download = 'Syed_Afraz_CV.pdf';
			document.body.appendChild(a);
			a.click();
			
			setTimeout(() => {
				window.URL.revokeObjectURL(url);
				document.body.removeChild(a);
			}, 100);
			
			console.log('✓ CV downloaded successfully');
		} catch (error) {
			console.error('Error downloading CV:', error);
			const message = error instanceof Error ? error.message : 'Failed to download CV';
			alert(`${message}\n\nPlease make sure the backend server is running on http://localhost:8000`);
		}
	};

	if (!mounted) {
		return null;
	}

	// Continuous zoom calculation based on scroll progress
	const zoomLevel = 1 - (scrollProgress * 0.28); // Smooth interpolation from 1 to 0.72

	return (
		<div className="relative min-h-screen overflow-hidden">
			{/* Progress bar with stronger backdrop blur */}
			{!activeCard && (
				<div className="fixed top-8 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 px-4 py-2 rounded-full border border-border bg-white/90 dark:bg-card/90 backdrop-blur-xl shadow-lg">
					<ProgressIndicator progress={scrollProgress} />
				</div>
			)}

			<div className="fixed top-6 right-6 z-40">
				<ThemeToggle />
			</div>

			{/* Optimized Motion cursor */}
			<motion.div
				className="fixed w-32 h-32 rounded-full bg-accent pointer-events-none z-10 mix-blend-difference transition-opacity duration-300"
				style={{ 
					x: cursorXSpring,
					y: cursorYSpring,
					translateX: "-50%",
					translateY: "-50%",
					opacity: activeCard ? 0 : 1,
				}}
			/>

			{!activeCard ? (
				<div
					ref={containerRef}
					className="overflow-x-auto overflow-y-hidden h-screen hide-scrollbar"
				>
					<div 
						className="scroll-content flex h-full"
						style={{ 
							transform: `scale(${zoomLevel})`,
							transition: 'none',
							willChange: 'transform',
						}}
					>
						{/* Hero Card */}
						<section className="flex-shrink-0 w-[70vw] h-screen flex items-center pl-8 md:pl-16 pr-4">
							<motion.div 
								className="w-full h-[85vh] border border-border bg-white/80 dark:bg-card/80 backdrop-blur-xl p-12 md:p-16 flex flex-col justify-end pb-16 shadow-2xl rounded-xl"
								whileHover={{ scale: 1.02, y: -8, rotateX: 2 }}
								transition={{ duration: 0.4, ease: [0.34, 1.56, 0.64, 1] }}
							>
								<motion.div
									initial={{ opacity: 0, y: 30 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{ delay: 0.3, duration: 0.8, ease: [0.34, 1.56, 0.64, 1] }}
								>
								{/* Top row: Name + Profile Image */}
								<div className="flex items-start justify-between gap-8 mb-2">
									<div>
										<h1 className="text-6xl md:text-7xl lg:text-8xl font-medium leading-tight tracking-tight mb-6">
											Syed Afraz
										</h1>

										{/* Social Links below name */}
										<div className="flex items-center gap-2">
											<motion.a
												href="https://github.com/Shah-Afraz411"
												target="_blank"
												rel="noopener noreferrer"
												className="flex items-center justify-center w-10 h-10 rounded-full border border-border bg-background hover:border-foreground/40 hover:bg-foreground/5 transition-all"
												whileHover={{ scale: 1.1, y: -2 }}
												whileTap={{ scale: 0.95 }}
												transition={{ type: "spring", stiffness: 400, damping: 10 }}
												aria-label="GitHub Profile"
											>
												<Github className="w-4 h-4" />
											</motion.a>
											
											<motion.a
												href="https://www.linkedin.com/in/syed-afraz-shah/"
												target="_blank"
												rel="noopener noreferrer"
												className="flex items-center justify-center w-10 h-10 rounded-full border border-border bg-background hover:border-foreground/40 hover:bg-foreground/5 transition-all"
												whileHover={{ scale: 1.1, y: -2 }}
												whileTap={{ scale: 0.95 }}
												transition={{ type: "spring", stiffness: 400, damping: 10 }}
												aria-label="LinkedIn Profile"
											>
												<Linkedin className="w-4 h-4" />
											</motion.a>
										</div>
									</div>

									{/* Profile Image - Top Right */}
									<motion.div
										className="flex-shrink-0"
										initial={{ opacity: 0, scale: 0.8 }}
										animate={{ opacity: 1, scale: 1 }}
										transition={{ delay: 0.4, duration: 0.5 }}
									>
										<img
											src="/profile.jpeg"
											alt="Syed Afraz"
											className="w-48 h-48 md:w-56 md:h-56 lg:w-64 lg:h-64 object-cover rounded-xl border-2 border-border shadow-lg"
										/>
									</motion.div>
								</div>

									<p className="text-2xl md:text-3xl text-muted-foreground mb-8 max-w-2xl">
										AI Engineer & ML Specialist building scalable intelligent systems
									</p>
									
									{/* Action Buttons */}
									<div className="flex flex-wrap items-center gap-4 mb-8">
										<motion.button
											onClick={handleDownloadCV}
											className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-foreground text-background hover:bg-foreground/90 transition-all text-base font-medium shadow-lg hover:shadow-xl"
											whileHover={{ scale: 1.05, y: -2 }}
											whileTap={{ scale: 0.95 }}
											transition={{ type: "spring", stiffness: 400, damping: 10 }}
										>
											<Download className="w-4 h-4" />
											<span>Download CV</span>
										</motion.button>
										
										<motion.a
											href="mailto:syedafrazshah1100@gmail.com?subject=I%20saw%20your%20Portfolio"
											className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-foreground text-background hover:bg-foreground/90 transition-all text-base font-medium shadow-lg hover:shadow-xl"
											whileHover={{ scale: 1.05, y: -2 }}
											whileTap={{ scale: 0.95 }}
											transition={{ type: "spring", stiffness: 400, damping: 10 }}
											aria-label="Send email to Syed Afraz"
										>
											<span>Get in Touch</span>
											<motion.span 
												className="inline-block"
												animate={{ x: [0, 4, 0] }}
												transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
											>
												→
											</motion.span>
										</motion.a>
									</div>
									
									{/* Skills Tags with Proper Icons */}
									<div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
										<motion.span 
											className="px-4 py-2 rounded-full border border-border bg-background hover:border-foreground/40 hover:bg-foreground/5 transition-all cursor-default inline-flex items-center gap-2"
											whileHover={{ scale: 1.1, y: -2 }}
											transition={{ type: "spring", stiffness: 400, damping: 10 }}
										>
											<SiPython className="w-3.5 h-3.5" />
											<span>Python</span>
										</motion.span>
										<motion.span 
											className="px-4 py-2 rounded-full border border-border bg-background hover:border-foreground/40 hover:bg-foreground/5 transition-all cursor-default inline-flex items-center gap-2"
											whileHover={{ scale: 1.1, y: -2 }}
											transition={{ type: "spring", stiffness: 400, damping: 10 }}
										>
											<SiFastapi className="w-3.5 h-3.5" />
											<span>FastAPI</span>
										</motion.span>
										<motion.span 
											className="px-4 py-2 rounded-full border border-border bg-background hover:border-foreground/40 hover:bg-foreground/5 transition-all cursor-default inline-flex items-center gap-2"
											whileHover={{ scale: 1.1, y: -2 }}
											transition={{ type: "spring", stiffness: 400, damping: 10 }}
										>
											<TbSparkles className="w-3.5 h-3.5" />
											<span>AI/ML</span>
										</motion.span>
										<motion.span 
											className="px-4 py-2 rounded-full border border-border bg-background hover:border-foreground/40 hover:bg-foreground/5 transition-all cursor-default inline-flex items-center gap-2"
											whileHover={{ scale: 1.1, y: -2 }}
											transition={{ type: "spring", stiffness: 400, damping: 10 }}
										>
											<TbRobot className="w-3.5 h-3.5" />
											<span>Agentic AI</span>
										</motion.span>
										<motion.span 
											className="px-4 py-2 rounded-full border border-border bg-background hover:border-foreground/40 hover:bg-foreground/5 transition-all cursor-default inline-flex items-center gap-2"
											whileHover={{ scale: 1.1, y: -2 }}
											transition={{ type: "spring", stiffness: 400, damping: 10 }}
										>
											<SiTensorflow className="w-3.5 h-3.5" />
											<span>TensorFlow</span>
										</motion.span>
										<motion.span 
											className="px-4 py-2 rounded-full border border-border bg-background hover:border-foreground/40 hover:bg-foreground/5 transition-all cursor-default inline-flex items-center gap-2"
											whileHover={{ scale: 1.1, y: -2 }}
											transition={{ type: "spring", stiffness: 400, damping: 10 }}
										>
											<SiPytorch className="w-3.5 h-3.5" />
											<span>PyTorch</span>
										</motion.span>
										<motion.span 
											className="px-4 py-2 rounded-full border border-border bg-background hover:border-foreground/40 hover:bg-foreground/5 transition-all cursor-default inline-flex items-center gap-2"
											whileHover={{ scale: 1.1, y: -2 }}
											transition={{ type: "spring", stiffness: 400, damping: 10 }}
										>
											<TbSql className="w-3.5 h-3.5" />
											<span>SQL</span>
										</motion.span>
										<motion.span 
											className="px-4 py-2 rounded-full border border-border bg-background hover:border-foreground/40 hover:bg-foreground/5 transition-all cursor-default inline-flex items-center gap-2"
											whileHover={{ scale: 1.1, y: -2 }}
											transition={{ type: "spring", stiffness: 400, damping: 10 }}
										>
											<SiMongodb className="w-3.5 h-3.5" />
											<span>MongoDB</span>
										</motion.span>
									</div>
								</motion.div>
							</motion.div>
						</section>

						{/* Chatbot Card */}
						<section className="flex-shrink-0 w-[70vw] h-screen flex items-center px-4">
							<motion.div
								onClick={() => setActiveCard("chatbot")}
								className="cursor-pointer group w-full h-[85vh] border border-border bg-white/80 dark:bg-card/80 backdrop-blur-xl p-12 md:p-16 hover:bg-white/90 dark:hover:bg-card/90 transition-colors shadow-2xl rounded-xl"
								whileHover={{ scale: 1.02, y: -8, rotateX: 2 }}
								transition={{ duration: 0.4, ease: [0.34, 1.56, 0.64, 1] }}
							>
								<div className="flex flex-col h-full justify-between">
									<div>
										<h2 className="text-5xl md:text-6xl font-medium mb-4 group-hover:text-foreground/80 transition-colors">
											AI Assistant
										</h2>
										<p className="text-xl text-muted-foreground max-w-xl">
											Chat with my AI assistant powered by RAG technology. Ask anything about my work.
										</p>
									</div>
									<div className="flex items-center gap-2 text-lg text-muted-foreground">
										<span>Click to open</span>
										<motion.span 
											className="inline-block"
											animate={{ x: [0, 8, 0] }}
											transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
										>
											→
										</motion.span>
									</div>
								</div>
							</motion.div>
						</section>

						{/* Projects Card */}
						<section className="flex-shrink-0 w-[70vw] h-screen flex items-center px-4">
							<motion.div
								onClick={() => setActiveCard("projects")}
								className="cursor-pointer group w-full h-[85vh] border border-border bg-white/80 dark:bg-card/80 backdrop-blur-xl p-12 md:p-16 hover:bg-white/90 dark:hover:bg-card/90 transition-colors shadow-2xl rounded-xl"
								whileHover={{ scale: 1.02, y: -8, rotateX: 2 }}
								transition={{ duration: 0.4, ease: [0.34, 1.56, 0.64, 1] }}
							>
								<div className="flex flex-col h-full justify-between">
									<div>
										<h2 className="text-5xl md:text-6xl font-medium mb-4 group-hover:text-foreground/80 transition-colors">
											Projects
										</h2>
										<p className="text-xl text-muted-foreground max-w-xl">
											Explore my latest work and side projects.
										</p>
									</div>
									<div className="flex items-center gap-2 text-lg text-muted-foreground">
										<span>Click to open</span>
										<motion.span 
											className="inline-block"
											animate={{ x: [0, 8, 0] }}
											transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
										>
											→
										</motion.span>
									</div>
								</div>
							</motion.div>
						</section>

						{/* Skills Card */}
						<section className="flex-shrink-0 w-[70vw] h-screen flex items-center px-4">
							<motion.div
								onClick={() => setActiveCard("skills")}
								className="cursor-pointer group w-full h-[85vh] border border-border bg-white/80 dark:bg-card/80 backdrop-blur-xl p-12 md:p-16 hover:bg-white/90 dark:hover:bg-card/90 transition-colors shadow-2xl rounded-xl"
								whileHover={{ scale: 1.02, y: -8, rotateX: 2 }}
								transition={{ duration: 0.4, ease: [0.34, 1.56, 0.64, 1] }}
							>
								<div className="flex flex-col h-full justify-between">
									<div>
										<h2 className="text-5xl md:text-6xl font-medium mb-4 group-hover:text-foreground/80 transition-colors">
											Skills
										</h2>
										<p className="text-xl text-muted-foreground max-w-xl">
											Technologies and tools I work with daily.
										</p>
									</div>
									<div className="flex items-center gap-2 text-lg text-muted-foreground">
										<span>Click to open</span>
										<motion.span 
											className="inline-block"
											animate={{ x: [0, 8, 0] }}
											transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
										>
											→
										</motion.span>
									</div>
								</div>
							</motion.div>
						</section>

						{/* Experience Card */}
						<section className="flex-shrink-0 w-[70vw] h-screen flex items-center px-4 pr-8 md:pr-16">
							<motion.div
								onClick={() => setActiveCard("experience")}
								className="cursor-pointer group w-full h-[85vh] border border-border bg-white/80 dark:bg-card/80 backdrop-blur-xl p-12 md:p-16 hover:bg-white/90 dark:hover:bg-card/90 transition-colors shadow-2xl rounded-xl"
								whileHover={{ scale: 1.02, y: -8, rotateX: 2 }}
								transition={{ duration: 0.4, ease: [0.34, 1.56, 0.64, 1] }}
							>
								<div className="flex flex-col h-full justify-between">
									<div>
										<h2 className="text-5xl md:text-6xl font-medium mb-4 group-hover:text-foreground/80 transition-colors">
											Experience
										</h2>
										<p className="text-xl text-muted-foreground max-w-xl">
											My professional journey and achievements.
										</p>
									</div>
									<div className="flex items-center gap-2 text-lg text-muted-foreground">
										<span>Click to open</span>
										<motion.span 
											className="inline-block"
											animate={{ x: [0, 8, 0] }}
											transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
										>
											→
										</motion.span>
									</div>
								</div>
							</motion.div>
						</section>
					</div>
				</div>
			) : (
				<div className="h-screen overflow-y-auto overflow-x-hidden">
					<div className="container mx-auto px-8 py-20 max-w-6xl">
						<button
							onClick={handleBackClick}
							className="mb-8 flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors text-lg"
						>
							<span>←</span>
							<span>Back</span>
						</button>

						{activeCard === "chatbot" && <ChatbotCard />}
						{activeCard === "projects" && <ProjectsCard />}
						{activeCard === "skills" && <SkillsCard />}
						{activeCard === "experience" && <ExperienceCard />}
					</div>
				</div>
			)}
		</div>
	);
}
