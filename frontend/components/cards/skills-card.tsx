"use client";

import { motion } from "framer-motion";
import { SiPython, SiTensorflow, SiPytorch, SiFastapi, SiMongodb, SiDocker, SiNumpy, SiPandas, SiScikitlearn, SiKubernetes, SiGooglecloud, SiAmazonwebservices, SiGit } from "react-icons/si";
import { TbBrain, TbSql, TbRobot, TbCloud } from "react-icons/tb";

const skills = [
	{
		category: "AI / ML",
		icon: <TbBrain className="w-5 h-5" />,
		items: [
			{ name: "TensorFlow", icon: <SiTensorflow className="w-4 h-4" />, level: 90 },
			{ name: "PyTorch", icon: <SiPytorch className="w-4 h-4" />, level: 85 },
			{ name: "Agentic AI", icon: <TbRobot className="w-4 h-4" />, level: 88 },
			{ name: "LangChain", icon: <TbBrain className="w-4 h-4" />, level: 92 },
			{ name: "Scikit-learn", icon: <SiScikitlearn className="w-4 h-4" />, level: 90 },
		],
	},
	{
		category: "Backend",
		icon: <SiFastapi className="w-5 h-5" />,
		items: [
			{ name: "Python", icon: <SiPython className="w-4 h-4" />, level: 95 },
			{ name: "FastAPI", icon: <SiFastapi className="w-4 h-4" />, level: 92 },
			{ name: "SQL", icon: <TbSql className="w-4 h-4" />, level: 85 },
			{ name: "MongoDB", icon: <SiMongodb className="w-4 h-4" />, level: 80 },
		],
	},
	{
		category: "Data & Tools",
		icon: <SiPandas className="w-5 h-5" />,
		items: [
			{ name: "Pandas", icon: <SiPandas className="w-4 h-4" />, level: 92 },
			{ name: "NumPy", icon: <SiNumpy className="w-4 h-4" />, level: 90 },
			{ name: "Docker", icon: <SiDocker className="w-4 h-4" />, level: 82 },
			{ name: "Git", icon: <SiGit className="w-4 h-4" />, level: 88 },
		],
	},
	{
		category: "Cloud & DevOps",
		icon: <TbCloud className="w-5 h-5" />,
		items: [
			{ name: "AWS", icon: <SiAmazonwebservices className="w-4 h-4" />, level: 78 },
			{ name: "GCP", icon: <SiGooglecloud className="w-4 h-4" />, level: 82 },
			{ name: "Kubernetes", icon: <SiKubernetes className="w-4 h-4" />, level: 72 },
			{ name: "CI/CD", icon: <TbCloud className="w-4 h-4" />, level: 80 },
		],
	},
];

export function SkillsCard() {
	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			className="space-y-8"
		>
			<div>
				<h1 className="text-5xl md:text-6xl font-medium mb-2 tracking-tight">
					Skills
				</h1>
				<p className="text-lg text-muted-foreground">
					Technologies and tools I work with daily
				</p>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
				{skills.map((skillGroup, idx) => (
					<motion.div
						key={skillGroup.category}
						initial={{ opacity: 0, y: 30 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: idx * 0.1 }}
						className="p-6 rounded-xl bg-foreground/[0.02] border border-border hover:border-foreground/20 transition-colors"
					>
						<div className="flex items-center gap-3 mb-5">
							<div className="w-9 h-9 rounded-xl bg-foreground/5 flex items-center justify-center text-foreground/60">
								{skillGroup.icon}
							</div>
							<h3 className="text-lg font-medium text-muted-foreground">
								{skillGroup.category}
							</h3>
						</div>
						<div className="space-y-3.5">
							{skillGroup.items.map((item, i) => (
								<motion.div
									key={item.name}
									initial={{ opacity: 0, x: -20 }}
									animate={{ opacity: 1, x: 0 }}
									transition={{ delay: idx * 0.1 + i * 0.05 }}
									className="group cursor-default"
								>
									<div className="flex items-center justify-between mb-1.5">
										<div className="flex items-center gap-2.5">
											<span className="text-foreground/50 group-hover:text-foreground/70 transition-colors">
												{item.icon}
											</span>
											<span className="text-base font-medium group-hover:text-foreground/80 transition-colors">
												{item.name}
											</span>
										</div>
										<span className="text-xs text-muted-foreground/50 font-mono opacity-0 group-hover:opacity-100 transition-opacity">
											{item.level}%
										</span>
									</div>
									<div className="h-1 w-full bg-foreground/5 rounded-full overflow-hidden">
										<motion.div
											className="h-full bg-foreground/20 rounded-full group-hover:bg-foreground/35 transition-colors"
											initial={{ width: 0 }}
											animate={{ width: `${item.level}%` }}
											transition={{ delay: idx * 0.1 + i * 0.08 + 0.2, duration: 0.8, ease: "easeOut" }}
										/>
									</div>
								</motion.div>
							))}
						</div>
					</motion.div>
				))}
			</div>
		</motion.div>
	);
}
