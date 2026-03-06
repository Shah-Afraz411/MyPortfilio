"""
Project Parser for reading project markdown files
"""

from pathlib import Path
import re
from typing import Dict, List, Optional, Any


def get_project_content_for_scoped_chat(project_id: str) -> Optional[str]:
    """Get project content from root data/projects folder"""
    backend_dir = Path(__file__).resolve().parent
    data_folder = backend_dir.parent / "data" / "projects"  # Root data folder

    project_file = data_folder / f"{project_id}.md"

    print(f"🔍 Looking for project file: {project_file}")

    if not project_file.exists():
        print(f"❌ Project file not found: {project_file}")
        print(
            f"📂 Data folder contents: {list(data_folder.glob('*.md')) if data_folder.exists() else 'folder does not exist'}"
        )
        return None

    try:
        with open(project_file, "r", encoding="utf-8") as f:
            content = f.read()
        print(f"✓ Loaded project content for: {project_id} ({len(content)} characters)")
        return content
    except Exception as e:
        print(f"❌ Error reading project file: {e}")
        return None


def parse_project_markdown(project_id: str) -> Optional[Dict[str, Any]]:
    """Parse project markdown from root data/projects folder"""
    backend_dir = Path(__file__).resolve().parent
    data_folder = backend_dir.parent / "data" / "projects"

    project_file = data_folder / f"{project_id}.md"

    if not project_file.exists():
        return None

    try:
        with open(project_file, "r", encoding="utf-8") as f:
            content = f.read()

        # Extract title (first heading)
        title_match = re.search(r"^#\s+(.+)$", content, re.MULTILINE)
        title = title_match.group(1) if title_match else "Untitled Project"

        # Extract sections
        def extract_section(section_name: str) -> str:
            pattern = rf"\*\*{section_name}:\*\*\s*\n(.+?)(?=\n\*\*|\Z)"
            match = re.search(pattern, content, re.DOTALL)
            return match.group(1).strip() if match else ""

        def extract_list_items(text: str) -> List[str]:
            """Extract bullet points from text"""
            lines = text.split("\n")
            items = []
            for line in lines:
                line = line.strip()
                if line.startswith("- "):
                    items.append(line[2:].strip())
            return items

        # Extract overview
        overview = extract_section("Overview")

        # Extract tech stack
        tech_stack_text = extract_section("Tech Stack")
        tech_stack = [t.strip() for t in tech_stack_text.split(",") if t.strip()]

        # Extract features
        features_text = extract_section("Key Features")
        features = extract_list_items(features_text)

        # Extract challenges
        challenges_text = extract_section("Challenges Faced")
        challenges = challenges_text.split("\n")
        challenges = [c.strip() for c in challenges if c.strip()]

        # Extract outcome
        outcome = extract_section("Outcome")

        # Extract learnings (if available)
        learnings_text = extract_section("Learnings")
        learnings = extract_list_items(learnings_text) if learnings_text else []

        # Extract links
        links_text = extract_section("Links")
        github_link = None
        demo_link = None

        if links_text:
            github_match = re.search(r"GitHub:\s*(.+?)(?=\n|$)", links_text)
            demo_match = re.search(r"Demo:\s*(.+?)(?=\n|$)", links_text)

            if github_match:
                github_link = github_match.group(1).strip()
            if demo_match:
                demo_text = demo_match.group(1).strip()
                if demo_text.lower() != "not publicly deployed":
                    demo_link = demo_text

        # Extract year - try multiple patterns
        year_text = extract_section("Year")
        if not year_text or year_text == "N/A":
            # Try to find year in the content as a standalone number
            year_match = re.search(r"\*\*Year:\*\*\s*(\d{4})", content)
            if year_match:
                year = year_match.group(1)
            else:
                year = "N/A"
        else:
            year = year_text.strip()

        return {
            "title": title,
            "overview": overview,
            "techStack": tech_stack,
            "features": features,
            "challenges": challenges,
            "outcome": outcome,
            "learnings": learnings,
            "links": {"github": github_link, "demo": demo_link},
            "year": year,
        }
    except Exception as e:
        print(f"Error parsing project {project_id}: {e}")
        return None
