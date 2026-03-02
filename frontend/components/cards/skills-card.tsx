"use client";

import { motion } from "framer-motion";

const skills = [
	{
		category: "AI / ML",
		items: ["TensorFlow", "PyTorch", "Agentic AI", "LangChain"],
	},
	{
		category: "Backend",
		items: ["Python", "FastAPI", "SQL", "MongoDB"],
	},
	{
		category: "Data & Tools",
		items: ["Pandas", "NumPy", "Scikit-learn", "Docker"],
	},
	{ category: "Cloud & DevOps", items: ["AWS", "GCP", "Git", "CI/CD"] },
];

export function SkillsCard() {
	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			className="space-y-8"
		>
			<div>
				<h1 className="text-5xl md:text-6xl font-medium mb-4 tracking-tight">
					Skills
				</h1>
				<p className="text-xl text-muted-foreground">
					Technologies and tools I work with
				</p>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 gap-12">
				{skills.map((skillGroup, idx) => (
					<motion.div
						key={skillGroup.category}
						initial={{ opacity: 0, y: 30 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: idx * 0.1 }}
					>
						<h3 className="text-xl font-medium mb-6 text-muted-foreground">
							{skillGroup.category}
						</h3>
						<ul className="space-y-3">
							{skillGroup.items.map((item, i) => (
								<motion.li
									key={item}
									initial={{ opacity: 0, x: -20 }}
									animate={{ opacity: 1, x: 0 }}
									transition={{ delay: idx * 0.1 + i * 0.05 }}
									whileHover={{ x: 8 }}
									className="text-2xl font-medium cursor-default hover:text-muted-foreground transition-colors"
								>
									{item}
								</motion.li>
							))}
						</ul>
					</motion.div>
				))}
			</div>
		</motion.div>
	);
}
