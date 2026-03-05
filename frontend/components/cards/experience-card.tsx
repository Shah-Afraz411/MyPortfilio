"use client";

import { motion } from "framer-motion";

const experiences = [
	{
		company: "CareCloud",
		role: "AI Engineer",
		period: "Jul 2025 — Present",
		isCurrent: true,
		highlights: [
			"Led automation of healthcare RCM softwares, improving operational efficiency",
			"Designed and deployed AI-based solutions for healthcare applications",
			"Built scalable architecture using async programming, multiprocessing & multithreading",
		],
		tags: ["Python", "FastAPI", "LLMs", "Healthcare AI", "Async"],
	},
	{
		company: "Automotive Artificial Intelligence (AAI)",
		role: "AI Developer",
		period: "Feb 2025 — Jun 2025",
		isCurrent: false,
		highlights: [
			"Developed intelligent text autocompletion system using Large Language Models",
			"Built backend services with FastAPI: auth, profiles, session handling",
		],
		tags: ["LLMs", "FastAPI", "NLP", "REST APIs"],
	},
	{
		company: "CARE Pvt. Ltd. – Center for Advanced Research in Engineering",
		role: "Software Intern",
		period: "Aug 2024 — Oct 2024",
		isCurrent: false,
		highlights: [
			"Designed UX workflows for Seller & Customer Portals",
			"Architected database ERD with 30+ entities",
			"Worked on AI modules: GANs, ResNet, MLP, Random Forest",
		],
		tags: ["GANs", "ResNet", "ERD Design", "Full Stack"],
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
				<h1 className="text-5xl md:text-6xl font-medium mb-2 tracking-tight">
					Experience
				</h1>
				<p className="text-lg text-muted-foreground">
					My professional journey in AI & software engineering
				</p>
			</div>

			<div className="relative">
				{/* Timeline line */}
				<div className="absolute left-[7px] top-4 bottom-4 w-px bg-gradient-to-b from-foreground/40 via-foreground/20 to-transparent" />

				<div className="space-y-10">
					{experiences.map((exp, idx) => (
						<motion.div
							key={`${exp.company}-${idx}`}
							initial={{ opacity: 0, x: -20 }}
							animate={{ opacity: 1, x: 0 }}
							transition={{ delay: idx * 0.15, duration: 0.5 }}
							className="group cursor-default relative pl-10"
						>
							{/* Timeline dot */}
							<div className="absolute left-0 top-1.5">
								<div className={`w-[15px] h-[15px] rounded-full border-2 transition-colors ${
									exp.isCurrent
										? 'bg-foreground border-foreground shadow-[0_0_8px_rgba(0,0,0,0.15)]'
										: 'bg-background border-foreground/30 group-hover:border-foreground/60'
								}`}>
									{exp.isCurrent && (
										<motion.div
											className="absolute inset-0 rounded-full border border-foreground/30"
											animate={{ scale: [1, 1.8], opacity: [0.5, 0] }}
											transition={{ duration: 1.5, repeat: Infinity }}
										/>
									)}
								</div>
							</div>

							<div className="group-hover:translate-x-2 transition-transform duration-300">
								<div className="flex items-center gap-3 mb-1">
									<h3 className="text-2xl md:text-3xl font-medium group-hover:text-foreground/80 transition-colors">
										{exp.role}
									</h3>
									{exp.isCurrent && (
										<span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-foreground text-background">
											Current
										</span>
									)}
								</div>
								<div className="flex items-center gap-2 mb-4">
									<p className="text-lg text-muted-foreground">{exp.company}</p>
									<span className="text-muted-foreground/40">·</span>
									<span className="text-sm text-muted-foreground/60">{exp.period}</span>
								</div>

								{/* Bullet points */}
								<ul className="space-y-2 mb-4">
									{exp.highlights.map((item, i) => (
										<li key={i} className="flex items-start gap-2.5 text-muted-foreground">
											<span className="w-1 h-1 rounded-full bg-foreground/40 mt-2.5 flex-shrink-0" />
											<span className="text-[15px] leading-relaxed">{item}</span>
										</li>
									))}
								</ul>

								{/* Tech tags */}
								<div className="flex flex-wrap gap-1.5">
									{exp.tags.map((tag) => (
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
		</motion.div>
	);
}
