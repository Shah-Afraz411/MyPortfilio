"use client";

import { motion } from "framer-motion";

const experiences = [
	{
		company: "CareCloud",
		role: "AI Engineer",
		period: "Jul 2025 — Present",
		description:
			"Led automation of healthcare RCM softwares, improving operational efficiency and reducing manual intervention. Designed and deployed AI-based solutions for various healthcare applications. Contributed to system architecture ensuring scalability using asynchronous programming, multiprocessing, and multithreading techniques.",
	},
	{
		company: "Automotive Artificial Intelligence (AAI)",
		role: "AI Developer",
		period: "Feb 2025 — Jun 2025",
		description:
			"Developed and deployed an intelligent text autocompletion system using Large Language Models (LLMs) and FastAPI. Designed and implemented backend services including user profile management, authentication, and session handling.",
	},
	{
		company: "CARE Pvt. Ltd. – Center for Advanced Research in Engineering",
		role: "Software Intern",
		period: "Aug 2024 — Oct 2025",
		description:
			"Designed website workflows enhancing user experience of Seller and Customer Portals. Designed an ERD with over 30 entities to structure the database. Worked on AI modules including GANs, ResNet, MLP, and Random Forest.",
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
