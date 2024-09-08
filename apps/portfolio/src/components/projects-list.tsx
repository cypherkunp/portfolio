import React from 'react';

type Project = {
  title: string;
  description: string;
  techStack: string[];
  link: {
    href: string;
    text: string;
  };
};

export function ProjectsList({ projects }: { projects: Project[] }) {
  return (
    <ul>
      {projects.map(project => (
        <li key={project.title}>
          <h3>{project.title}</h3>
          <p>{project.description}</p>
          <p>{project.techStack.join(', ')}</p>
          <a href={project.link.href}>{project.link.text}</a>
        </li>
      ))}
    </ul>
  );
}
