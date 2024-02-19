import { GitHubIcon, LinkedInIcon, XIcon } from "@/components/icons";

export const RESUME_DATA = {
  name: "Devvrat Shukla",
  initials: "DS",
  location: "London, UK",
  locationLink: "",
  about:
    " Full Stack Architect | Lead Experience Engineer | Software Craftsman",
  summary:
    "I am a seasoned software architect with 13.5 years of diverse experience in software product development. As a full stack architect, I have successfully taken multiple products from 0 to 1. I have a deep expertise in full stack development using technologies such as Typescript, JavaScript, NextJS, ReactJS, NodeJS and Serverless. I have led and architected several multi-million dollar projects including greenfield and rewrites of legacy products. I lead teams effectively, ensuring an environment where people can do their best work.",
  avatarUrl: "https://avatars.githubusercontent.com/u/1528663?v=4",
  personalWebsiteUrl: "https://jarocki.me",
  contact: {
    email: "devvrat.shukla@gmail.com",
    tel: "",
    social: [
      {
        name: "GitHub",
        url: "https://github.com/cypherkunp",
        icon: GitHubIcon,
      },
      {
        name: "LinkedIn",
        url: "https://www.linkedin.com/in/devvratshukla/",
        icon: LinkedInIcon,
      },
      {
        name: "X",
        url: "https://twitter.com/cypherkunp",
        icon: XIcon,
      },
    ],
  },
  education: [
    {
      school: "University of Pune, India",
      degree: "Bachelor's Degree in Computer Science",
      start: "2006",
      end: "2010",
    },
  ],
  work: [
    {
      company: "Publicis Sapient - London, UK",
      link: "https://www.publicissapient.com/",
      badges: [],
      title: "Lead Experience Engineer ",
      logo: null,
      start: "2019",
      end: "2024  ",
      description:
        "Led and architected several multi-million dollar projects including greenfield and rewrites of legacy products in various domains such as E-commerce, Retail, Finance and Banking.",
    },
    {
      company: "PTC Inc. - Pune, India",
      link: "https://www.ptc.com/",
      badges: [],
      title: "Tech Lead",
      logo: null,
      start: "2011",
      end: "2019",
      description:
        "Led and developed numerous projects based on frontend in React, Angular, Javascirpt and JQuery and backend in NodeJS and Java in various domains such as ALM (Application Lifecycle Management) and IOT",
    },
    {
      company: "Mphasis - Pune, India",
      link: "https://www.mphasis.com/",
      badges: [],
      title: "Technical Support Associate",
      logo: null,
      start: "2010",
      end: "2011",
      description:
        "Worked on handling and troubleshooting network and remote access-related issues (Cisco VPN Client, strong authentication devices, network connectivity)",
    },
  ],
  skills: [
    "Web Development",
    "JavaScript",
    "ReactJS",
    "NextJS",
    "NodeJS",
    "StencilJS",
    "Typescript",
    "NFRs",
    "ExpressJS",
    "HTML & CSS",
    "Microservices",
    "RESTApi",
    "Lambda Functions",
    "Edge Functions",
    "CI/CD",
    "Amazon AWS",
    "Docker",
    "Web3",
    "Cloud Computing",
  ],
  projects: [],
} as const;
