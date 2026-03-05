"use client";

import { motion } from "framer-motion";
import { Award } from "lucide-react";

// Placeholder data - replace with actual certifications later
const certifications: {
	title: string;
	issuer: string;
	date: string;
	credentialId?: string;
	highlights: string[];
	tags: string[];
}[] = [];

export function CertificationsCard() {
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

			{certifications.length > 0 ? (
				<div className="relative">
					{/* Timeline line */}
					<div className="absolute left-[7px] top-4 bottom-4 w-px bg-gradient-to-b from-foreground/40 via-foreground/20 to-transparent" />

					<div className="space-y-10">
						{certifications.map((cert, idx) => (
							<motion.div
								key={`${cert.title}-${idx}`}
								initial={{ opacity: 0, x: -20 }}
								animate={{ opacity: 1, x: 0 }}
								transition={{ delay: idx * 0.15, duration: 0.5 }}
								className="group cursor-default relative pl-10"
							>
								{/* Timeline dot */}
								<div className="absolute left-0 top-1.5">
									<div className="w-[15px] h-[15px] rounded-full border-2 bg-background border-foreground/30 group-hover:border-foreground/60 transition-colors" />
								</div>

								<div className="group-hover:translate-x-2 transition-transform duration-300">
									<h3 className="text-2xl md:text-3xl font-medium group-hover:text-foreground/80 transition-colors mb-1">
										{cert.title}
									</h3>
									<div className="flex items-center gap-2 mb-4">
										<p className="text-lg text-muted-foreground">{cert.issuer}</p>
										<span className="text-muted-foreground/40">·</span>
										<span className="text-sm text-muted-foreground/60">{cert.date}</span>
										{cert.credentialId && (
											<>
												<span className="text-muted-foreground/40">·</span>
												<span className="text-xs text-muted-foreground/50 font-mono">{cert.credentialId}</span>
											</>
										)}
									</div>

									{/* Bullet points */}
									<ul className="space-y-2 mb-4">
										{cert.highlights.map((item, i) => (
											<li key={i} className="flex items-start gap-2.5 text-muted-foreground">
												<span className="w-1 h-1 rounded-full bg-foreground/40 mt-2.5 flex-shrink-0" />
												<span className="text-[15px] leading-relaxed">{item}</span>
											</li>
										))}
									</ul>

									{/* Tech tags */}
									<div className="flex flex-wrap gap-1.5">
										{cert.tags.map((tag) => (
											<span
												key={tag}
												className="text-xs px-2.5 py-1 rounded-full bg-foreground/5 border border-border text-muted-foreground/70 group-hover:border-foreground/20 transition-colors"
											>
												{tag}
											</span>
										))}
									</div>
								</div>
							</motion.div>
						))}
					</div>
				</div>
			) : (
				<div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
					<Award className="w-16 h-16 mb-4 opacity-20" />
					<p className="text-xl">Certifications data coming soon...</p>
				</div>
			)}
		</motion.div>
	);
}
