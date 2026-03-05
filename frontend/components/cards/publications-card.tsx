"use client";

import { motion } from "framer-motion";
import { BookOpen } from "lucide-react";

// Placeholder data - replace with actual publications later
const publications: {
	title: string;
	journal: string;
	date: string;
	doi?: string;
	abstract: string;
	tags: string[];
}[] = [];

export function PublicationsCard() {
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
					Research papers and publications
				</p>
			</div>

			{publications.length > 0 ? (
				<div className="space-y-8">
					{publications.map((pub, idx) => (
						<motion.div
							key={`${pub.title}-${idx}`}
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: idx * 0.15, duration: 0.5 }}
							className="group cursor-default p-6 rounded-xl bg-foreground/[0.02] border border-border hover:border-foreground/20 transition-colors"
						>
							<h3 className="text-xl md:text-2xl font-medium group-hover:text-foreground/80 transition-colors mb-2">
								{pub.title}
							</h3>
							<div className="flex items-center gap-2 mb-3">
								<p className="text-base text-muted-foreground">{pub.journal}</p>
								<span className="text-muted-foreground/40">·</span>
								<span className="text-sm text-muted-foreground/60">{pub.date}</span>
								{pub.doi && (
									<>
										<span className="text-muted-foreground/40">·</span>
										<a
											href={`https://doi.org/${pub.doi}`}
											target="_blank"
											rel="noopener noreferrer"
											className="text-xs text-muted-foreground/50 font-mono hover:text-foreground/70 transition-colors"
										>
											{pub.doi}
										</a>
									</>
								)}
							</div>
							<p className="text-[15px] text-muted-foreground/80 leading-relaxed mb-4">
								{pub.abstract}
							</p>
							<div className="flex flex-wrap gap-1.5">
								{pub.tags.map((tag) => (
									<span
										key={tag}
										className="text-xs px-2.5 py-1 rounded-full bg-foreground/5 border border-border text-muted-foreground/70 group-hover:border-foreground/20 transition-colors"
									>
										{tag}
									</span>
								))}
							</div>
						</motion.div>
					))}
				</div>
			) : (
				<div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
					<BookOpen className="w-16 h-16 mb-4 opacity-20" />
					<p className="text-xl">Publications data coming soon...</p>
				</div>
			)}
		</motion.div>
	);
}
