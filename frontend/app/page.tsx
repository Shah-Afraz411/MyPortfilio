"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, useMotionValue, useSpring, AnimatePresence } from "framer-motion";
import Lenis from "@studio-freight/lenis";
import { ChatbotCard } from "@/components/cards/chatbot-card";
import { ProjectsCard } from "@/components/cards/projects-card";
import { SkillsCard } from "@/components/cards/skills-card";
import { ExperienceCard } from "@/components/cards/experience-card";
import { CertificationsCard } from "@/components/cards/certifications-card";
import { PublicationsCard } from "@/components/cards/publications-card";
import { ThemeToggle } from "@/components/theme-toggle";
import { Download, Github, Linkedin, MessageSquare, FolderGit2, Zap, Briefcase, Award, BookOpen } from "lucide-react";
import { SiPython, SiMongodb, SiFastapi, SiTensorflow, SiPytorch } from "react-icons/si";
import { TbBrain, TbSql, TbSparkles, TbRobot } from "react-icons/tb";

type CardType = "chatbot" | "projects" | "skills" | "experience" | "certifications" | "publications" | null;

const cards = [
	{ id: "hero", label: "Home" },
	{ id: "chatbot", label: "AI Assistant" },
	{ id: "projects", label: "Projects" },
	{ id: "skills", label: "Skills" },
	{ id: "experience", label: "Experience" },
];

function ProgressIndicator({
	progress,
	labels,
	swipePhase,
}: {
	progress: number;
	labels: string[];
	swipePhase: number;
}) {
	const activeIndex = Math.min(Math.floor(progress * labels.length), labels.length - 1);
	// How many hidden sections remain beyond the current phase view
	const hiddenCount = 2 - swipePhase;

	return (
		<div className="flex items-center gap-3">
			{labels.map((label, i) => {
				const isActive = i === activeIndex;
				const isPast = i < activeIndex;
				return (
					<div key={i} className="flex items-center gap-3">
						<div className="flex items-center gap-1.5">
							<div className={`w-2 h-2 rounded-full transition-all duration-300 ${
								isActive ? 'bg-foreground scale-125' : isPast ? 'bg-foreground/50' : 'bg-border'
							}`} />
							<span className={`text-xs font-medium transition-all duration-300 hidden sm:inline ${
								isActive ? 'text-foreground' : 'text-muted-foreground/60'
							}`}>{label}</span>
						</div>
						{i < labels.length - 1 && (
							<div className={`w-6 h-px transition-colors duration-300 ${
								isPast ? 'bg-foreground/40' : 'bg-border'
							}`} />
						)}
					</div>
				);
			})}
			{/* Trailing hint dots — fade smoothly as phases reveal content */}
			<div className={`flex items-center gap-1.5 transition-all duration-500 ${hiddenCount > 0 ? 'opacity-100' : 'opacity-0 w-0 overflow-hidden'}`}>
				<div className="w-4 h-px bg-border/60" />
				<div className="flex items-center gap-1">
					{[0, 1].map((dot) => (
						<div
							key={dot}
							className={`rounded-full transition-all duration-500 ${
								dot < hiddenCount
									? 'w-1.5 h-1.5 bg-foreground/25'
									: 'w-1 h-1 bg-foreground/8'
							}`}
						/>
					))}
				</div>
			</div>
		</div>
	);
}

export default function Home() {
	const [activeCard, setActiveCard] = useState<CardType>(null);
	const [mounted, setMounted] = useState(false);
	const [scrollProgress, setScrollProgress] = useState(0);
	const [swipePhase, setSwipePhase] = useState(0);
	const containerRef = useRef<HTMLDivElement>(null);
	const lenisRef = useRef<Lenis | null>(null);
	const rafRef = useRef<number | null>(null);
	const savedScrollRef = useRef<number>(0);
	const savedProgressRef = useRef<number>(0);

	// Optimized cursor with reduced spring
	const cursorX = useMotionValue(0);
	const cursorY = useMotionValue(0);
	const cursorXSpring = useSpring(cursorX, { damping: 30, stiffness: 150, mass: 0.5 });
	const cursorYSpring = useSpring(cursorY, { damping: 30, stiffness: 150, mass: 0.5 });

	useEffect(() => {
		setMounted(true);
	}, []);

	// Restore scroll position after returning from a card detail view
	useEffect(() => {
		if (!mounted || activeCard) return;
		const container = containerRef.current;
		if (container && savedScrollRef.current > 0) {
			container.scrollLeft = savedScrollRef.current;
			setScrollProgress(savedProgressRef.current);
		}
	}, [mounted, activeCard]);

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

	// Edge scroll/swipe detection for phase transitions
	// KEY RULE: When swipePhase > 0, ALL backward scroll is BLOCKED until phases revert to 0.
	// Forward advance uses dwell + gesture threshold so it doesn't trigger during normal scrolling.
	useEffect(() => {
		if (!mounted || activeCard) return;
		const container = containerRef.current;
		if (!container) return;

		let locked = false;
		let edgeDwellTimer: ReturnType<typeof setTimeout> | null = null;
		let atEdge = false;
		let gestureDelta = 0;
		let backDelta = 0;
		let touchStartX = 0;

		const DWELL_MS = 300;
		const GESTURE_THRESHOLD = 250;
		const BACK_THRESHOLD = 120;       // lower threshold for going back (feels more responsive)
		const LOCK_MS = 800;

		const isAtRightEdge = () => {
			const maxScroll = container.scrollWidth - container.clientWidth;
			return container.scrollLeft >= maxScroll - 10;
		};

		const triggerPhase = (direction: 1 | -1) => {
			locked = true;
			atEdge = false;
			gestureDelta = 0;
			backDelta = 0;
			if (edgeDwellTimer) { clearTimeout(edgeDwellTimer); edgeDwellTimer = null; }
			setSwipePhase(prev => Math.max(0, Math.min(2, prev + direction)));
			setTimeout(() => { locked = false; atEdge = false; gestureDelta = 0; backDelta = 0; }, LOCK_MS);
		};

		const handleWheel = (e: WheelEvent) => {
			const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;

			// CRITICAL: When swipePhase > 0 and user scrolls backward, BLOCK the scroll
			// and consume it to revert phases. This prevents the page from scrolling left
			// before all phases are unwound back to 0.
			if (swipePhase > 0 && delta < 0) {
				e.preventDefault();
				e.stopPropagation();
				if (locked) return;
				backDelta += Math.abs(delta);
				if (backDelta >= BACK_THRESHOLD) {
					triggerPhase(-1);
				}
				return;
			}

			// Normal forward phase advance logic (only at the right edge with dwell)
			if (locked) return;

			if (!isAtRightEdge()) {
				atEdge = false;
				gestureDelta = 0;
				if (edgeDwellTimer) { clearTimeout(edgeDwellTimer); edgeDwellTimer = null; }
				return;
			}

			// At the right edge
			if (!atEdge && !edgeDwellTimer) {
				edgeDwellTimer = setTimeout(() => {
					atEdge = true;
					gestureDelta = 0;
				}, DWELL_MS);
				return;
			}

			if (!atEdge) return;

			gestureDelta += delta;

			if (gestureDelta >= GESTURE_THRESHOLD && swipePhase < 2) {
				triggerPhase(1);
			}
		};

		const handleTouchStart = (e: TouchEvent) => { touchStartX = e.touches[0].clientX; };
		const handleTouchEnd = (e: TouchEvent) => {
			if (locked) return;
			const deltaX = touchStartX - e.changedTouches[0].clientX;

			// Forward: only at right edge
			if (deltaX > 100 && isAtRightEdge() && swipePhase < 2) {
				triggerPhase(1);
			}
			// Backward: always intercept while phase > 0
			else if (deltaX < -80 && swipePhase > 0) {
				triggerPhase(-1);
			}
		};

		// MUST be non-passive so we can preventDefault() on backward scroll when phase > 0
		container.addEventListener('wheel', handleWheel, { passive: false });
		container.addEventListener('touchstart', handleTouchStart, { passive: true });
		container.addEventListener('touchend', handleTouchEnd, { passive: true });

		return () => {
			container.removeEventListener('wheel', handleWheel);
			container.removeEventListener('touchstart', handleTouchStart);
			container.removeEventListener('touchend', handleTouchEnd);
			if (edgeDwellTimer) clearTimeout(edgeDwellTimer);
		};
	}, [mounted, activeCard, swipePhase]);

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

	// Enhanced back click with scroll restoration
	const handleBackClick = useCallback(() => {
		setActiveCard(null);
	}, []);

	// Download CV handler
	const handleDownloadCV = async (e: React.MouseEvent) => {
		e.preventDefault();
		e.stopPropagation();
		
		try {
			const apiUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
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
			alert(`${message}\n\nPlease make sure the backend server is running.`);
		}
	};

	// Dynamic section labels based on swipe phase
	const currentSectionLabels = swipePhase === 1 
		? ["Home", "AI Chat", "Projects", "Skills", "Certs"] 
		: swipePhase === 2 
			? ["Home", "AI Chat", "Projects", "Certs", "Pubs"]
			: ["Home", "AI Chat", "Projects", "Skills", "Experience"];

	if (!mounted) {
		return null;
	}

	// Continuous zoom calculation based on scroll progress
	const zoomLevel = 1 - (scrollProgress * 0.28); // Smooth interpolation from 1 to 0.72

	return (
		<div className="relative z-10 min-h-screen overflow-hidden">
			{/* Progress bar with stronger backdrop blur */}
			{!activeCard && (
				<div className="fixed top-8 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 px-4 py-2 rounded-full border border-border bg-white/90 dark:bg-card/90 backdrop-blur-xl shadow-lg">
					<ProgressIndicator progress={scrollProgress} labels={currentSectionLabels} swipePhase={swipePhase} />
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
						<section className="flex-shrink-0 w-[71vw] h-screen flex items-center pl-20 md:pl-32 pr-4">
							<motion.div 
								className="w-full h-[80vh] border border-border bg-white/80 dark:bg-card/80 backdrop-blur-xl p-12 md:p-16 flex flex-col justify-end pb-16 shadow-2xl rounded-xl"
								whileHover={{ scale: 1.02, y: -8, rotateX: 2 }}
								transition={{ duration: 0.4, ease: [0.34, 1.56, 0.64, 1] }}
							>
								<motion.div
									initial={{ opacity: 0, y: 30 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{ delay: 0.3, duration: 0.8, ease: [0.34, 1.56, 0.64, 1] }}
								>
								{/* Top row: Name + Profile Image */}
								<div className="flex items-start justify-between gap-8 mb-2 mt-10">
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
											className="w-48 h-48 md:w-56 md:h-56 lg:w-64 lg:h-64 object-cover rounded-full border-2 border-border shadow-lg"
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
						<section className="flex-shrink-0 w-[68vw] h-screen flex items-center px-4">
							<motion.div
								onClick={() => { savedScrollRef.current = containerRef.current?.scrollLeft ?? 0; savedProgressRef.current = scrollProgress; setActiveCard("chatbot"); }}
								className="cursor-pointer group w-full h-[78vh] border border-border bg-white/80 dark:bg-card/80 backdrop-blur-xl p-12 md:p-16 hover:bg-white/90 dark:hover:bg-card/90 transition-colors shadow-2xl rounded-xl"
								whileHover={{ scale: 1.02, y: -8, rotateX: 2 }}
								transition={{ duration: 0.4, ease: [0.34, 1.56, 0.64, 1] }}
							>
								<div className="flex flex-col h-full justify-between">
									<div>
										<div className="flex items-center gap-4 mb-6">
											<div className="w-12 h-12 rounded-2xl bg-foreground/5 border border-border flex items-center justify-center group-hover:bg-foreground/10 transition-colors">
												<MessageSquare className="w-6 h-6 text-foreground/70" />
											</div>
											<span className="text-xs font-medium uppercase tracking-widest text-muted-foreground/60">02 / 05</span>
										</div>
										<h2 className="text-5xl md:text-6xl font-medium mb-4 group-hover:text-foreground/80 transition-colors">
											AI Assistant
										</h2>
										<p className="text-xl text-muted-foreground max-w-xl mb-10">
											Chat with my AI assistant powered by RAG technology. Ask anything about my work.
										</p>
										{/* Chat Preview */}
										<div className="space-y-3 max-w-md">
											<div className="flex items-start gap-3">
												<div className="w-7 h-7 rounded-full bg-foreground/10 flex items-center justify-center flex-shrink-0 mt-0.5">
													<span className="text-xs">You</span>
												</div>
												<div className="px-4 py-2.5 rounded-2xl bg-foreground/5 border border-border text-sm text-muted-foreground">
													What projects has Afraz worked on?
												</div>
											</div>
											<div className="flex items-start gap-3">
												<div className="w-7 h-7 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0 mt-0.5">
													<TbSparkles className="w-3.5 h-3.5" />
												</div>
												<div className="px-4 py-2.5 rounded-2xl bg-foreground/5 border border-border text-sm text-muted-foreground">
													Afraz has built several AI/ML projects including...
												</div>
											</div>
										</div>
									</div>
									<div className="flex items-center gap-2 text-lg text-muted-foreground group-hover:text-foreground transition-colors">
										<span>Start chatting</span>
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
						<section className="flex-shrink-0 w-[67vw] h-screen flex items-center px-4">
							<motion.div
								onClick={() => { savedScrollRef.current = containerRef.current?.scrollLeft ?? 0; savedProgressRef.current = scrollProgress; setActiveCard("projects"); }}
								className="cursor-pointer group w-full h-[76vh] border border-border bg-white/80 dark:bg-card/80 backdrop-blur-xl p-12 md:p-16 hover:bg-white/90 dark:hover:bg-card/90 transition-colors shadow-2xl rounded-xl"
								whileHover={{ scale: 1.02, y: -8, rotateX: 2 }}
								transition={{ duration: 0.4, ease: [0.34, 1.56, 0.64, 1] }}
							>
								<div className="flex flex-col h-full justify-between">
									<div>
										<div className="flex items-center gap-4 mb-6">
											<div className="w-12 h-12 rounded-2xl bg-foreground/5 border border-border flex items-center justify-center group-hover:bg-foreground/10 transition-colors">
												<FolderGit2 className="w-6 h-6 text-foreground/70" />
											</div>
											<span className="text-xs font-medium uppercase tracking-widest text-muted-foreground/60">03 / 05</span>
										</div>
										<h2 className="text-5xl md:text-6xl font-medium mb-4 group-hover:text-foreground/80 transition-colors">
											Projects
										</h2>
										<p className="text-xl text-muted-foreground max-w-xl mb-10">
											AI/ML projects spanning NLP, computer vision, and intelligent systems.
										</p>
										{/* Project Preview Tiles */}
										<div className="grid grid-cols-2 gap-3 max-w-lg">
											{["Financial News Analysis", "Intrusion Detection", "Law Autocomplete", "AI Portfolio"].map((name, i) => (
												<div key={name} className="px-4 py-3 rounded-xl bg-foreground/5 border border-border group-hover:border-foreground/20 transition-colors">
													<span className="text-xs text-muted-foreground/40 font-mono">0{i + 1}</span>
													<p className="text-sm font-medium mt-0.5">{name}</p>
												</div>
											))}
										</div>
									</div>
									<div className="flex items-center gap-2 text-lg text-muted-foreground group-hover:text-foreground transition-colors">
										<span>View all projects</span>
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

						{/* Dynamic Card - Position 4 (Skills / Certifications) */}
						<section className="flex-shrink-0 w-[66vw] h-screen flex items-center px-4">
							<motion.div
								onClick={() => { savedScrollRef.current = containerRef.current?.scrollLeft ?? 0; savedProgressRef.current = scrollProgress; setActiveCard(swipePhase < 2 ? "skills" : "certifications"); }}
								className="cursor-pointer group w-full h-[74vh] border border-border bg-white/80 dark:bg-card/80 backdrop-blur-xl p-12 md:p-16 hover:bg-white/90 dark:hover:bg-card/90 transition-colors shadow-2xl rounded-xl overflow-hidden"
								whileHover={{ scale: 1.02, y: -8, rotateX: 2 }}
								transition={{ duration: 0.4, ease: [0.34, 1.56, 0.64, 1] }}
							>
								<AnimatePresence mode="wait">
									{swipePhase < 2 ? (
										<motion.div key="skills-slot4" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.3 }} className="flex flex-col h-full justify-between">
											<div>
												<div className="flex items-center gap-4 mb-6">
													<div className="w-12 h-12 rounded-2xl bg-foreground/5 border border-border flex items-center justify-center group-hover:bg-foreground/10 transition-colors">
														<Zap className="w-6 h-6 text-foreground/70" />
													</div>
													<span className="text-xs font-medium uppercase tracking-widest text-muted-foreground/60">04 / 05</span>
												</div>
												<h2 className="text-5xl md:text-6xl font-medium mb-4 group-hover:text-foreground/80 transition-colors">
													Skills
												</h2>
												<p className="text-xl text-muted-foreground max-w-xl mb-10">
													Technologies and tools I work with daily.
												</p>
												<div className="flex flex-wrap gap-2 max-w-lg">
													{["Python", "TensorFlow", "PyTorch", "FastAPI", "LangChain", "Docker", "SQL", "XGBoost", "Pandas", "GCP", "Kubernetes", "GANs"].map((skill) => (
														<span key={skill} className="px-3 py-1.5 text-sm rounded-full bg-foreground/5 border border-border text-muted-foreground group-hover:border-foreground/20 transition-colors">
															{skill}
														</span>
													))}
													<span className="px-3 py-1.5 text-sm rounded-full bg-foreground/5 border border-dashed border-foreground/20 text-muted-foreground/60">+more</span>
												</div>
											</div>
											<div className="flex items-center gap-2 text-lg text-muted-foreground group-hover:text-foreground transition-colors">
												<span>View all skills</span>
												<motion.span className="inline-block" animate={{ x: [0, 8, 0] }} transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}>→</motion.span>
											</div>
										</motion.div>
									) : (
										<motion.div key="certs-slot4" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.3 }} className="flex flex-col h-full justify-between">
											<div>
												<div className="flex items-center gap-4 mb-6">
													<div className="w-12 h-12 rounded-2xl bg-foreground/5 border border-border flex items-center justify-center group-hover:bg-foreground/10 transition-colors">
														<Award className="w-6 h-6 text-foreground/70" />
													</div>
													<span className="text-xs font-medium uppercase tracking-widest text-muted-foreground/60">04 / 05</span>
												</div>
												<h2 className="text-5xl md:text-6xl font-medium mb-4 group-hover:text-foreground/80 transition-colors">
													Certifications
												</h2>
												<p className="text-xl text-muted-foreground max-w-xl mb-10">
													Professional certifications and credentials.
												</p>
												<div className="space-y-3 max-w-lg">
													<div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-foreground/5 border border-border group-hover:border-foreground/20 transition-colors">
														<Award className="w-5 h-5 text-foreground/30" />
														<div>
															<p className="text-sm font-medium">Data coming soon</p>
															<p className="text-xs text-muted-foreground/60">Certifications will be listed here</p>
														</div>
													</div>
												</div>
											</div>
											<div className="flex items-center gap-2 text-lg text-muted-foreground group-hover:text-foreground transition-colors">
												<span>View certifications</span>
												<motion.span className="inline-block" animate={{ x: [0, 8, 0] }} transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}>→</motion.span>
											</div>
										</motion.div>
									)}
								</AnimatePresence>
							</motion.div>
						</section>

						{/* Dynamic Card - Position 5 (Experience / Certifications / Publications) */}
						<section className="flex-shrink-0 w-[66vw] h-screen flex items-center px-4 pr-8 md:pr-16">
							<motion.div
								onClick={() => { savedScrollRef.current = containerRef.current?.scrollLeft ?? 0; savedProgressRef.current = scrollProgress; setActiveCard(swipePhase === 0 ? "experience" : swipePhase === 1 ? "certifications" : "publications"); }}
								className="cursor-pointer group w-full h-[74vh] border border-border bg-white/80 dark:bg-card/80 backdrop-blur-xl p-12 md:p-16 hover:bg-white/90 dark:hover:bg-card/90 transition-colors shadow-2xl rounded-xl overflow-hidden relative"
								whileHover={{ scale: 1.02, y: -8, rotateX: 2 }}
								transition={{ duration: 0.4, ease: [0.34, 1.56, 0.64, 1] }}
							>
								<AnimatePresence mode="wait">
									{swipePhase === 0 ? (
										<motion.div key="exp-slot5" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.3 }} className="flex flex-col h-full justify-between">
											<div>
												<div className="flex items-center gap-4 mb-6">
													<div className="w-12 h-12 rounded-2xl bg-foreground/5 border border-border flex items-center justify-center group-hover:bg-foreground/10 transition-colors">
														<Briefcase className="w-6 h-6 text-foreground/70" />
													</div>
													<span className="text-xs font-medium uppercase tracking-widest text-muted-foreground/60">05 / 05</span>
												</div>
												<h2 className="text-5xl md:text-6xl font-medium mb-4 group-hover:text-foreground/80 transition-colors">Experience</h2>
												<p className="text-xl text-muted-foreground max-w-xl mb-10">My professional journey in AI and software engineering.</p>
												<div className="space-y-4 max-w-lg">
													{[
														{ role: "AI Engineer", company: "CareCloud", period: "2025 — Present" },
														{ role: "AI Developer", company: "AAI", period: "2025" },
														{ role: "Software Intern", company: "CARE Pvt. Ltd.", period: "2024 — 2025" },
													].map((exp, i) => (
														<div key={i} className="flex items-center gap-4">
															<div className="flex flex-col items-center">
																<div className={`w-3 h-3 rounded-full ${i === 0 ? 'bg-foreground' : 'bg-foreground/30'}`} />
																{i < 2 && <div className="w-px h-6 bg-border mt-1" />}
															</div>
															<div className="flex-1">
																<p className="text-base font-medium">{exp.role}</p>
																<p className="text-sm text-muted-foreground">{exp.company} · {exp.period}</p>
															</div>
														</div>
													))}
												</div>
											</div>
											<div className="flex items-center gap-2 text-lg text-muted-foreground group-hover:text-foreground transition-colors">
												<span>View full timeline</span>
												<motion.span className="inline-block" animate={{ x: [0, 8, 0] }} transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}>→</motion.span>
											</div>
										</motion.div>
									) : swipePhase === 1 ? (
										<motion.div key="certs-slot5" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.3 }} className="flex flex-col h-full justify-between">
											<div>
												<div className="flex items-center gap-4 mb-6">
													<div className="w-12 h-12 rounded-2xl bg-foreground/5 border border-border flex items-center justify-center group-hover:bg-foreground/10 transition-colors">
														<Award className="w-6 h-6 text-foreground/70" />
													</div>
													<span className="text-xs font-medium uppercase tracking-widest text-muted-foreground/60">05 / 05</span>
												</div>
												<h2 className="text-5xl md:text-6xl font-medium mb-4 group-hover:text-foreground/80 transition-colors">Certifications</h2>
												<p className="text-xl text-muted-foreground max-w-xl mb-10">Professional certifications and credentials.</p>
												<div className="space-y-3 max-w-lg">
													<div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-foreground/5 border border-border group-hover:border-foreground/20 transition-colors">
														<Award className="w-5 h-5 text-foreground/30" />
														<div>
															<p className="text-sm font-medium">Data coming soon</p>
															<p className="text-xs text-muted-foreground/60">Certifications will be listed here</p>
														</div>
													</div>
												</div>
											</div>
											<div className="flex items-center gap-2 text-lg text-muted-foreground group-hover:text-foreground transition-colors">
												<span>View certifications</span>
												<motion.span className="inline-block" animate={{ x: [0, 8, 0] }} transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}>→</motion.span>
											</div>
										</motion.div>
									) : (
										<motion.div key="pubs-slot5" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.3 }} className="flex flex-col h-full justify-between">
											<div>
												<div className="flex items-center gap-4 mb-6">
													<div className="w-12 h-12 rounded-2xl bg-foreground/5 border border-border flex items-center justify-center group-hover:bg-foreground/10 transition-colors">
														<BookOpen className="w-6 h-6 text-foreground/70" />
													</div>
													<span className="text-xs font-medium uppercase tracking-widest text-muted-foreground/60">05 / 05</span>
												</div>
												<h2 className="text-5xl md:text-6xl font-medium mb-4 group-hover:text-foreground/80 transition-colors">Publications</h2>
												<p className="text-xl text-muted-foreground max-w-xl mb-10">Research papers and publications.</p>
												<div className="space-y-3 max-w-lg">
													<div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-foreground/5 border border-border group-hover:border-foreground/20 transition-colors">
														<BookOpen className="w-5 h-5 text-foreground/30" />
														<div>
															<p className="text-sm font-medium">Data coming soon</p>
															<p className="text-xs text-muted-foreground/60">Publications will be listed here</p>
														</div>
													</div>
												</div>
											</div>
											<div className="flex items-center gap-2 text-lg text-muted-foreground group-hover:text-foreground transition-colors">
												<span>View publications</span>
												<motion.span className="inline-block" animate={{ x: [0, 8, 0] }} transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}>→</motion.span>
											</div>
										</motion.div>
									)}
								</AnimatePresence>

								{/* Phase navigation dots */}
								<div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 z-10">
									{[0, 1, 2].map((phase) => (
										<button
											key={phase}
											onClick={(e) => { e.stopPropagation(); setSwipePhase(phase); }}
											className={`rounded-full transition-all duration-300 ${
												swipePhase === phase ? 'w-6 h-1.5 bg-foreground/50' : 'w-1.5 h-1.5 bg-foreground/15 hover:bg-foreground/30'
											}`}
											title={["Experience", "Certifications", "Publications"][phase]}
										/>
									))}
								</div>

								{/* Swipe hint */}
								{swipePhase < 2 && (
									<motion.div
										className="absolute bottom-6 right-8 flex items-center gap-1 text-[11px] text-muted-foreground/30 pointer-events-none"
										animate={{ x: [0, 4, 0] }}
										transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
									>
										<span>more</span>
										<span>→</span>
									</motion.div>
								)}
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
						{activeCard === "certifications" && <CertificationsCard />}
						{activeCard === "publications" && <PublicationsCard />}
					</div>
				</div>
			)}
		</div>
	);
}
