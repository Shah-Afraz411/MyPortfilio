"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Award, ExternalLink, GraduationCap } from "lucide-react";

interface Certification {
	title: string;
	issuer: string;
	platform: string;
	date: string;
	credentialUrl: string;
	featured?: boolean;
	tags: string[];
}

const certifications: Certification[] = [
	{
		title: "Machine Learning Specialization",
		issuer: "Stanford University & DeepLearning.AI",
		platform: "Coursera",
		date: "2024",
		credentialUrl: "https://coursera.org/share/656c4989841f186efa2bdd573a91f0b7",
		featured: true,
		tags: ["Machine Learning", "Neural Networks", "Supervised Learning", "Unsupervised Learning"],
	},
	{
		title: "Supervised Machine Learning: Regression and Classification",
		issuer: "Stanford University & DeepLearning.AI",
		platform: "Coursera",
		date: "2024",
		credentialUrl: "https://coursera.org/share/b41dd459656dd0a9dc794656dccc2d27",
		tags: ["Regression", "Classification", "Gradient Descent", "Logistic Regression"],
	},
	{
		title: "Advanced Learning Algorithms",
		issuer: "Stanford University & DeepLearning.AI",
		platform: "Coursera",
		date: "2024",
		credentialUrl: "https://coursera.org/share/787c011fe8db5d87a9508276e751d4ae",
		tags: ["Neural Networks", "Decision Trees", "TensorFlow", "Deep Learning"],
	},
	{
		title: "Unsupervised Learning, Recommenders, Reinforcement Learning",
		issuer: "Stanford University & DeepLearning.AI",
		platform: "Coursera",
		date: "2024",
		credentialUrl: "https://coursera.org/share/ff8de7d507a6eef68d1347aa5eb04f6c",
		tags: ["Clustering", "Anomaly Detection", "Recommender Systems", "Reinforcement Learning"],
	},
	{
		title: "LangChain for LLM Application Development",
		issuer: "DeepLearning.AI",
		platform: "DeepLearning.AI",
		date: "2024",
		credentialUrl: "https://learn.deeplearning.ai/accomplishments/4c64626f-ddeb-4c72-8122-0b891596efe8?usp=sharing",
		tags: ["LangChain", "LLM", "Prompt Engineering", "AI Applications"],
	},
	{
		title: "LangChain: Chat with Your Data",
		issuer: "DeepLearning.AI",
		platform: "DeepLearning.AI",
		date: "2024",
		credentialUrl: "https://learn.deeplearning.ai/accomplishments/6eb24796-a27c-449e-8b58-0c4f0042f478?usp=sharing",
		tags: ["LangChain", "RAG", "Vector Databases", "Document QA"],
	},
	{
		title: "Career Essentials in GitHub Professional Certificate",
		issuer: "LinkedIn Learning",
		platform: "LinkedIn",
		date: "2024",
		credentialUrl: "https://www.linkedin.com/learning/certificates/551891d62813d768b1879912ec3327ebad56688c6f1688ee7a30bee6fe880fec",
		tags: ["GitHub", "Version Control", "CI/CD", "Collaboration"],
	},
];

export function CertificationsCard() {
	const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			className="space-y-8"
		>
			<div>
				<h1 className="text-5xl md:text-6xl font-medium mb-2 tracking-tight">
					Certifications
				</h1>
				<p className="text-lg text-muted-foreground">
					Professional certifications and credentials
				</p>
			</div>

			{/* Featured Certification */}
			{certifications.filter(c => c.featured).map((cert, idx) => (
				<motion.a
					key={idx}
					href={cert.credentialUrl}
					target="_blank"
					rel="noopener noreferrer"
					initial={{ opacity: 0, y: 16 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.1, duration: 0.5 }}
					className="block p-6 rounded-xl bg-gradient-to-br from-foreground/[0.04] to-foreground/[0.08] border border-foreground/10 hover:border-foreground/25 transition-all group"
				>
					<div className="flex items-start justify-between mb-4">
						<div className="flex items-center gap-3">
							<div className="w-11 h-11 rounded-xl bg-foreground/10 flex items-center justify-center">
								<GraduationCap className="w-5 h-5 text-foreground/70" />
							</div>
							<div>
								<span className="text-xs font-medium uppercase tracking-widest text-muted-foreground/50">Featured</span>
								<h3 className="text-xl md:text-2xl font-medium leading-tight">{cert.title}</h3>
							</div>
						</div>
						<ExternalLink className="w-4 h-4 text-muted-foreground/40 group-hover:text-foreground/60 transition-colors shrink-0 mt-1" />
					</div>
					<div className="flex items-center gap-2 text-sm text-muted-foreground/70 mb-4">
						<span>{cert.issuer}</span>
						<span className="text-muted-foreground/30">·</span>
						<span>{cert.platform}</span>
						<span className="text-muted-foreground/30">·</span>
						<span>{cert.date}</span>
					</div>
					<div className="flex flex-wrap gap-1.5">
						{cert.tags.map(tag => (
							<span key={tag} className="text-xs px-2.5 py-1 rounded-full bg-foreground/5 border border-border text-muted-foreground/70">
								{tag}
							</span>
						))}
					</div>
				</motion.a>
			))}

			{/* Other Certifications Grid */}
			<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
				{certifications.filter(c => !c.featured).map((cert, idx) => (
					<motion.a
						key={idx}
						href={cert.credentialUrl}
						target="_blank"
						rel="noopener noreferrer"
						initial={{ opacity: 0, y: 12 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.15 + idx * 0.07, duration: 0.4 }}
						onMouseEnter={() => setHoveredIdx(idx)}
						onMouseLeave={() => setHoveredIdx(null)}
						className="group p-5 rounded-xl bg-foreground/[0.02] border border-border hover:border-foreground/20 hover:bg-foreground/[0.04] transition-all"
					>
						<div className="flex items-start justify-between mb-3">
							<div className="flex items-center gap-2.5">
								<Award className="w-4.5 h-4.5 text-muted-foreground/40 group-hover:text-foreground/60 transition-colors" />
								<h4 className="text-base font-medium leading-snug group-hover:text-foreground/90 transition-colors">
									{cert.title}
								</h4>
							</div>
							<ExternalLink className={`w-3.5 h-3.5 shrink-0 mt-0.5 transition-all ${hoveredIdx === idx ? 'text-foreground/50 translate-x-0' : 'text-transparent -translate-x-1'}`} />
						</div>
						<p className="text-sm text-muted-foreground/60 mb-3">
							{cert.issuer} · {cert.date}
						</p>
						<div className="flex flex-wrap gap-1">
							{cert.tags.slice(0, 3).map(tag => (
								<span key={tag} className="text-[11px] px-2 py-0.5 rounded-full bg-foreground/5 border border-border text-muted-foreground/60">
									{tag}
								</span>
							))}
							{cert.tags.length > 3 && (
								<span className="text-[11px] px-2 py-0.5 rounded-full bg-foreground/5 border border-border text-muted-foreground/40">
									+{cert.tags.length - 3}
								</span>
							)}
						</div>
					</motion.a>
				))}
			</div>
		</motion.div>
	);
}
