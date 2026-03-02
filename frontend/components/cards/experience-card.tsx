"use client";

import { motion } from "framer-motion";

const experiences = [
	{
		company: "Tech Innovators Inc",
		role: "Senior Frontend Developer",
		period: "2022 — Present",
		description: "Leading frontend architecture and design system implementation",
	},
	{
		company: "Digital Solutions Co",
		role: "Full Stack Developer",
		period: "2020 — 2022",
		description: "Built scalable web applications with modern frameworks",
	},
	{
		company: "StartUp Ventures",
		role: "Frontend Developer",
		period: "2018 — 2020",
		description: "Created responsive interfaces for mobile-first applications",
	},
];

export function ExperienceCard() {
	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			className="space-y-8"
		>
			<div>
				<h1 className="text-5xl md:text-6xl font-medium mb-4 tracking-tight">
					Experience
				</h1>
				<p className="text-xl text-muted-foreground">
					My professional journey
				</p>
			</div>

			<div className="space-y-12">
				{experiences.map((exp, idx) => (
					<motion.div
						key={`${exp.company}-${idx}`}
						initial={{ opacity: 0, y: 30 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: idx * 0.1 }}
						whileHover={{ x: 8 }}
						className="group cursor-default"
					>
						<div className="flex items-start justify-between gap-8 border-t border-border pt-8">
							<div className="flex-1">
								<h3 className="text-2xl md:text-3xl font-medium mb-2 group-hover:text-muted-foreground transition-colors">
									{exp.role}
								</h3>
								<p className="text-xl text-muted-foreground mb-3">
									{exp.company}
								</p>
								<p className="text-muted-foreground max-w-2xl">
									{exp.description}
								</p>
							</div>
							<span className="text-sm text-muted-foreground whitespace-nowrap">
								{exp.period}
							</span>
						</div>
					</motion.div>
				))}
			</div>
		</motion.div>
	);
}
