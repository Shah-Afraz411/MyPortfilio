"use client";

import { ExternalLink, Github, X, Send } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

const projects = [
	{
		id: "portfolio-site",
		title: "AI Portfolio Website",
		description: "A fully responsive portfolio website built with Next.js",
		longDescription:
			"A fully responsive portfolio website built with Next.js, featuring an AI-powered chatbot using RAG technology, smooth animations with Framer Motion, and a minimal design inspired by Rauno.me. The site includes horizontal scrolling, interactive cards, and a custom cursor follower.",
		technologies: ["Next.js", "Framer Motion", "Tailwind", "RAG", "Gemini"],
		image: "/projects/portfolio-site.svg",
		githubUrl: "https://github.com/Shah-Afraz411",
	},
	{
		id: "financial-news-analysis",
		title: "Financial News Analysis & Stock Prediction",
		description: "NLP-powered financial news sentiment analysis and stock forecasting",
		longDescription:
			"A data science project that analyzes financial news articles using NLP techniques and machine learning models to forecast stock price movements. Combines sentiment analysis of news with LSTM neural networks for time series prediction, exploring the correlation between news sentiment and stock market performance.",
		technologies: ["Python", "NLTK", "TensorFlow", "LSTM", "scikit-learn", "yfinance"],
		image: "/projects/financial-news-analysis.svg",
		githubUrl: "https://github.com/Shah-Afraz411/Financial-News-Analysis-and-Stock-Prediction",
	},
	{
		id: "network-intrusion-detection",
		title: "Network Intrusion Detection Benchmarking",
		description: "ML model comparison for cybersecurity intrusion detection",
		longDescription:
			"A comprehensive comparative evaluation of four machine learning algorithms (Random Forest, XGBoost, SVM, MLP) for network intrusion detection. Addresses class imbalance using a novel hybrid resampling strategy on the CICIDS2017 dataset, achieving 98.91% accuracy with Random Forest.",
		technologies: ["Python", "scikit-learn", "XGBoost", "SMOTE", "Jupyter"],
		image: "/projects/network-intrusion-detection.svg",
		githubUrl: "https://github.com/Shah-Afraz411/Model-Benchmarking-for-Network-Intrusion-Detection",
	},
	{
		id: "law-autocomplete-service",
		title: "Law Autocomplete Service",
		description: "Real-time legal autocomplete microservice with LLM integration",
		longDescription:
			"An intelligent, domain-aware, real-time autocomplete microservice for legal search inputs. Features a FastAPI async backend, Streamlit real-time UI, Google Vertex AI Gemini integration with mock fallback, Docker containerization, and category-tagged suggestions for German/EU law domains.",
		technologies: ["FastAPI", "Streamlit", "Vertex AI", "Docker", "Python"],
		image: "/projects/law-autocomplete-service.svg",
		githubUrl: "https://github.com/Shah-Afraz411/Law_Autocomplete_Service",
	},
];

interface Project {
	id: string;
	title: string;
	description: string;
	longDescription?: string;
	technologies: string[];
	image: string;
	demoUrl?: string;
	githubUrl?: string;
}

export function ProjectsCard() {
	const [selectedProject, setSelectedProject] = useState<Project | null>(null);
	const [message, setMessage] = useState("");
	const [chatMessages, setChatMessages] = useState<Array<{ role: string; content: string }>>([]);
	const [isLoading, setIsLoading] = useState(false);

	const handleSendMessage = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!message.trim() || !selectedProject || isLoading) return;

		const userMessage = message.trim();
		setMessage("");

		setChatMessages((prev) => [...prev, { role: "user", content: userMessage }]);
		setIsLoading(true);

		try {
			const apiUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";
			const response = await fetch(`${apiUrl}/chat/project/${selectedProject.id}`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ message: userMessage }),
			});

			if (!response.ok) {
				throw new Error("Failed to get response");
			}

			const data = await response.json();
			setChatMessages((prev) => [...prev, { role: "assistant", content: data.answer }]);
		} catch (error) {
			console.error("Error sending message:", error);
			setChatMessages((prev) => [
				...prev,
				{
					role: "assistant",
					content: "Sorry, I couldn't process your request. Please try again.",
				},
			]);
		} finally {
			setIsLoading(false);
		}
	};

	const handleProjectClick = (project: Project) => {
		setSelectedProject(project);
		setChatMessages([]);
	};

	const handleCloseModal = () => {
		setSelectedProject(null);
		setChatMessages([]);
		setMessage("");
	};

	return (
		<div>
			<div className="mb-8">
				<h1 className="text-5xl md:text-6xl font-medium mb-2 tracking-tight">
					Projects
				</h1>
				<p className="text-lg text-muted-foreground">
					AI/ML projects spanning NLP, cybersecurity, and intelligent systems
				</p>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
				{projects.map((project, index) => (
					<motion.div
						key={project.id}
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: index * 0.1 }}
						onClick={() => handleProjectClick(project)}
						className="group cursor-pointer border border-border rounded-xl overflow-hidden hover:border-foreground/30 transition-all bg-card/50 hover:bg-card relative"
						whileHover={{ y: -4 }}
					>
						<div className="aspect-video bg-muted relative overflow-hidden">
							{/* Project number badge */}
							<div className="absolute top-3 left-3 z-10 w-8 h-8 rounded-lg bg-background/80 backdrop-blur border border-border flex items-center justify-center">
								<span className="text-xs font-mono font-bold">0{index + 1}</span>
							</div>
							{index === 0 && (
								<div className="absolute top-3 right-3 z-10 px-2 py-0.5 rounded-md bg-foreground text-background text-[10px] font-semibold uppercase tracking-wider">
									Featured
								</div>
							)}
							{project.image ? (
								<img
									src={project.image}
									alt={project.title}
									className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
								/>
							) : (
								<div className="absolute inset-0 bg-gradient-to-br from-accent/20 to-transparent" />
							)}
						</div>
						<div className="p-5 bg-card">
							<h3 className="text-lg font-semibold mb-1.5 group-hover:text-foreground transition-colors">
								{project.title}
							</h3>
							<p className="text-muted-foreground text-sm mb-3 line-clamp-2">
								{project.description}
							</p>
							<div className="flex flex-wrap gap-1.5">
								{project.technologies?.slice(0, 3).map((tech, i) => (
									<span
										key={i}
										className="text-xs px-2.5 py-1 bg-foreground/5 border border-border rounded-full font-medium group-hover:border-foreground/20 transition-colors"
									>
										{tech}
									</span>
								))}
								{project.technologies.length > 3 && (
									<span className="text-xs px-2.5 py-1 text-muted-foreground/50">
										+{project.technologies.length - 3}
									</span>
								)}
							</div>
						</div>
					</motion.div>
				))}
			</div>

			{/* Project Detail Modal */}
			<AnimatePresence>
				{selectedProject && (
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
						onClick={handleCloseModal}
					>
						<motion.div
							initial={{ scale: 0.95, opacity: 0 }}
							animate={{ scale: 1, opacity: 1 }}
							exit={{ scale: 0.95, opacity: 0 }}
							onClick={(e) => e.stopPropagation()}
							className="bg-card border border-border rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
						>
							<div className="sticky top-0 bg-card/95 backdrop-blur-sm border-b border-border p-6 flex items-start justify-between">
								<div className="flex-1">
									<h2 className="text-2xl md:text-3xl font-medium mb-2">
										{selectedProject.title}
									</h2>
									<p className="text-muted-foreground text-sm">
										{selectedProject.description}
									</p>
								</div>
								<button
									onClick={handleCloseModal}
									className="p-2 hover:bg-muted rounded-lg transition-colors"
								>
									<X className="w-5 h-5" />
								</button>
							</div>

							{/* Content */}
							<div className="p-6 space-y-8">
								{/* Action Buttons */}
								<div className="flex gap-3">
									{selectedProject.demoUrl && (
										<a
											href={selectedProject.demoUrl}
											target="_blank"
											rel="noopener noreferrer"
											className="inline-flex items-center gap-2 px-4 py-2 bg-foreground text-background rounded-lg hover:bg-foreground/90 transition-colors"
										>
											<ExternalLink className="w-4 h-4" />
											Visit Site
										</a>
									)}
									{selectedProject.githubUrl && (
										<a
											href={selectedProject.githubUrl}
											target="_blank"
											rel="noopener noreferrer"
											className="inline-flex items-center gap-2 px-4 py-2 border border-border rounded-lg hover:bg-muted transition-colors"
										>
											<Github className="w-4 h-4" />
											View Code
										</a>
									)}
								</div>

								{/* About Section */}
								<div>
									<h3 className="text-xl font-medium mb-3">About this project</h3>
									<p className="text-muted-foreground leading-relaxed">
										{selectedProject.longDescription ||
											selectedProject.description}
									</p>
								</div>

								{/* Technologies */}
								<div>
									<h3 className="text-lg font-medium mb-3">Technologies</h3>
									<div className="flex flex-wrap gap-2">
										{selectedProject.technologies?.map((tech, index) => (
											<span
												key={index}
												className="px-3 py-1 bg-muted text-sm rounded-full"
											>
												{tech}
											</span>
										))}
									</div>
								</div>

								{/* Project-Scoped Chat Interface */}
								<div className="pt-4">
									<h3 className="text-base font-medium mb-4">
										Ask me anything about this project
									</h3>

									{/* Chat Messages */}
									{chatMessages.length > 0 && (
										<div className="mb-4 space-y-3 max-h-64 overflow-y-auto">
											{chatMessages.map((msg, index) => (
												<div
													key={index}
													className={`${
														msg.role === "user"
															? "flex justify-end"
															: "flex justify-start"
													}`}
												>
													<div
														className={`px-4 py-2 rounded-lg text-sm max-w-[80%] ${
															msg.role === "user"
																? "bg-foreground text-background"
																: "bg-muted text-foreground"
														}`}
													>
														{msg.content}
													</div>
												</div>
											))}
											{isLoading && (
												<div className="flex justify-start">
													<div className="px-4 py-2 rounded-lg bg-muted">
														<div className="flex items-center gap-1">
															<div className="w-2 h-2 bg-foreground/60 rounded-full animate-bounce" />
															<div
																className="w-2 h-2 bg-foreground/60 rounded-full animate-bounce"
																style={{ animationDelay: "0.2s" }}
															/>
															<div
																className="w-2 h-2 bg-foreground/60 rounded-full animate-bounce"
																style={{ animationDelay: "0.4s" }}
															/>
														</div>
													</div>
												</div>
											)}
										</div>
									)}

									{/* Input Form */}
									<form onSubmit={handleSendMessage} className="flex gap-2">
										<input
											type="text"
											value={message}
											onChange={(e) => setMessage(e.target.value)}
											placeholder="What technologies were used?"
											className="flex-1 px-4 py-2 bg-muted border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-foreground/20"
											disabled={isLoading}
										/>
										<button
											type="submit"
											disabled={isLoading || !message.trim()}
											className="px-4 py-2 bg-foreground text-background rounded-lg hover:bg-foreground/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
										>
											<Send className="w-4 h-4" />
										</button>
									</form>

									{/* Scope Indicator */}
									<p className="text-xs text-muted-foreground mt-3">
										This chat is scoped to{" "}
										{selectedProject.title} only
									</p>
								</div>
							</div>
						</motion.div>
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
}
