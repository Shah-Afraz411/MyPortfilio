"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Download, ExternalLink, Calendar, Users, ImageIcon, X } from "lucide-react";
import Image from "next/image";

const publication = {
	title: "Development and Industrial Implementation of Pakistan's First Integrated Biofuel Production Process: A Pathway Toward Green Energy Transition",
	authors: [
		"Syed Shazaib Shah",
		"Muhammad Umar",
		"M. Syed Afraz Shah",
		"Lee Xiaona",
		"Tan Daoliang",
		"Zhang Dayi",
		"Zhang Qicheng",
	],
	date: "2025",
	journal: "The China International UGS Academic Conference",
	venue: "Shenzhen, China",
	doi: "10.13140/RG.2.2.22153.52325",
	researchGateUrl: "https://www.researchgate.net/publication/397601065",
	abstract:
		"This study presents Pakistan's first successful industrial implementation of bio-jet fuel production, marking a transformative milestone in the nation's transition toward sustainable energy. Developed and operated by BioTech Energy (Pvt.) Ltd. under SAFCO Ventures, the project establishes the country's first commercial-scale biodiesel and bio-jet fuel facility—an unprecedented achievement in South Asia's emerging green energy landscape. Utilizing locally available waste-based feedstocks such as used cooking oil, poultry fat, and other agricultural by-products, the process converts high-FFA organic waste into high-purity fatty acid methyl esters (FAME) through optimized pre-esterification and trans-esterification reactions, followed by advanced distillation and methanol recovery systems.",
	tags: [
		"Process Automation",
		"Industrial IoT",
		"Data Pipelines",
		"SCADA Systems",
		"Python",
		"Real-time Monitoring",
		"Green Energy",
		"Biofuel",
		"Machine Learning",
		"Sustainability",
	],
	figures: [
		{
			src: "/images/Fatty_acid_methyl_esterification.png",
			caption: "Figure 5: Transesterification reaction mechanism — Triglyceride conversion to FAME and Glycerol",
		},
		{
			src: "/images/Process-Control_Interface.png",
			caption: "Figure 8: SCADA Process Control Interface — Real-time monitoring of methanol recovery and distillation systems",
		},
		{
			src: "/images/biofuel-analysis-graph.png",
			caption: "Process Efficiency & Temperature Analysis — Conversion metrics across production stages",
		},
	],
};

export function PublicationsCard() {
	const [lightbox, setLightbox] = useState<number | null>(null);

	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			className="space-y-8"
		>
			<div>
				<h1 className="text-5xl md:text-6xl font-medium mb-2 tracking-tight">
					Publications
				</h1>
				<p className="text-lg text-muted-foreground">
					Research contributions and academic work
				</p>
			</div>

			{/* Publication Card */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: 0.15, duration: 0.5 }}
				className="p-6 rounded-xl bg-foreground/[0.02] border border-border"
			>
				{/* Title & Meta */}
				<h3 className="text-xl md:text-2xl font-medium mb-3 leading-tight">
					{publication.title}
				</h3>
				<div className="flex flex-wrap items-center gap-x-3 gap-y-1 mb-4 text-sm text-muted-foreground">
					<span className="flex items-center gap-1">
						<Calendar className="w-3.5 h-3.5" />
						{publication.date}
					</span>
					<span className="text-muted-foreground/30">·</span>
					<span>{publication.journal}</span>
					<span className="text-muted-foreground/30">·</span>
					<span className="text-muted-foreground/60">{publication.venue}</span>
				</div>

				{/* Action buttons */}
				<div className="flex flex-wrap gap-2 mb-4">
					<a
						href={publication.researchGateUrl}
						target="_blank"
						rel="noopener noreferrer"
						className="inline-flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-lg bg-foreground/5 border border-border hover:bg-foreground/10 transition-colors"
					>
						<ExternalLink className="w-3.5 h-3.5" />
						View on ResearchGate
					</a>
					<a
						href="/publications/biofuel-paper.pdf"
						download
						className="inline-flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-lg bg-foreground/5 border border-border hover:bg-foreground/10 transition-colors"
					>
						<Download className="w-3.5 h-3.5" />
						Download Paper
					</a>
				</div>

				{/* Authors */}
				<div className="flex items-start gap-2 mb-4">
					<Users className="w-4 h-4 mt-0.5 text-muted-foreground/60 shrink-0" />
					<p className="text-sm text-muted-foreground/80">
						{publication.authors.join(", ")}
					</p>
				</div>

				{/* Abstract */}
				<p className="text-[15px] text-muted-foreground/80 leading-relaxed mb-5">
					{publication.abstract}
				</p>

				{/* Tags */}
				<div className="flex flex-wrap gap-1.5 mb-8">
					{publication.tags.map((tag) => (
						<span
							key={tag}
							className="text-xs px-2.5 py-1 rounded-full bg-foreground/5 border border-border text-muted-foreground/70"
						>
							{tag}
						</span>
					))}
				</div>

				{/* Research Figures Gallery */}
				<div className="border-t border-border pt-6">
					<h4 className="text-lg font-medium mb-5 flex items-center gap-2">
						<ImageIcon className="w-5 h-5 text-muted-foreground/60" />
						Research Figures
					</h4>
					<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
						{publication.figures.map((fig, idx) => (
							<motion.button
								key={idx}
								initial={{ opacity: 0, y: 12 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ delay: 0.25 + idx * 0.1, duration: 0.4 }}
								onClick={() => setLightbox(idx)}
								className="group relative rounded-lg overflow-hidden border border-border hover:border-foreground/20 transition-colors cursor-pointer text-left"
							>
								<div className="aspect-[4/3] relative bg-foreground/[0.03]">
										<Image
											src={fig.src}
											alt={fig.caption}
											fill
											className="object-contain p-2"
										/>
									<div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/5 transition-colors" />
								</div>
								<p className="text-xs text-muted-foreground/60 px-3 py-2 bg-foreground/[0.02] border-t border-border">
									{fig.caption}
								</p>
							</motion.button>
						))}
					</div>
				</div>
			</motion.div>

			{/* Lightbox */}
			<AnimatePresence>
				{lightbox !== null && (
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						className="fixed inset-0 z-50 flex items-center justify-center bg-background/90 backdrop-blur-sm p-4"
						onClick={() => setLightbox(null)}
					>
						<motion.div
							initial={{ scale: 0.9, opacity: 0 }}
							animate={{ scale: 1, opacity: 1 }}
							exit={{ scale: 0.9, opacity: 0 }}
							className="relative max-w-4xl w-full max-h-[85vh] rounded-xl overflow-hidden border border-border bg-background"
							onClick={(e) => e.stopPropagation()}
						>
							<button
								onClick={() => setLightbox(null)}
								className="absolute top-3 right-3 z-10 p-1.5 rounded-full bg-foreground/10 hover:bg-foreground/20 transition-colors"
							>
								<X className="w-4 h-4" />
							</button>
							<div className="relative w-full h-[70vh]">
									<Image
										src={publication.figures[lightbox].src}
										alt={publication.figures[lightbox].caption}
										fill
										className="object-contain p-4"
									/>
							</div>
							<p className="text-sm text-muted-foreground px-4 py-3 border-t border-border text-center">
								{publication.figures[lightbox].caption}
							</p>
						</motion.div>
					</motion.div>
				)}
			</AnimatePresence>
		</motion.div>
	);
}
