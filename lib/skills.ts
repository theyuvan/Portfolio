export type SkillInfo = {
  id: number
  name: string
  label: string
  shortDescription: string
  color: string
  icon: string
}

export const SkillNames = {
  JS: 'js',
  TS: 'ts',
  HTML: 'html',
  CSS: 'css',
  REACT: 'react',
  NEXTJS: 'nextjs',
  JAVA: 'java',
  PYTHON: 'python',
  NODEJS: 'nodejs',
  EXPRESS: 'express',
  MYSQL: 'mysql',
  TAILWIND: 'tailwind',
  GIT: 'git',
  GITHUB: 'github',
  SOLIDITY: 'solidity',
  NPM: 'npm',
  FIREBASE: 'firebase',
  BLOCKCHAIN: 'blockchain',
  FIGMA: 'figma',
  DOCKER: 'docker',
  ADOBE: 'adobe',
  RENDER: 'render',
  GCP: 'gcp',
  VERCEL: 'vercel',
} as const

export const SKILLS: Record<string, SkillInfo> = {
  js: {
    id: 1,
    name: 'js',
    label: 'JavaScript',
    shortDescription: 'A scripting language used to make web pages interactive and dynamic.',
    color: '#f0db4f',
    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg',
  },
  ts: {
    id: 2,
    name: 'ts',
    label: 'TypeScript',
    shortDescription: 'A superset of JavaScript that adds static typing and better tooling support.',
    color: '#007acc',
    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg',
  },
  html: {
    id: 3,
    name: 'html',
    label: 'HTML',
    shortDescription: 'The standard markup language used to structure content on the web.',
    color: '#e34c26',
    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg',
  },
  css: {
    id: 4,
    name: 'css',
    label: 'CSS',
    shortDescription: 'A style sheet language used to describe the visual presentation of HTML elements.',
    color: '#563d7c',
    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg',
  },
  react: {
    id: 5,
    name: 'react',
    label: 'React',
    shortDescription: 'A JavaScript library for building fast and reusable user interfaces using components.',
    color: '#61dafb',
    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg',
  },
  nextjs: {
    id: 6,
    name: 'nextjs',
    label: 'Next.js',
    shortDescription: 'A React framework for building full-stack web apps with SSR and routing.',
    color: '#ffffff',
    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg',
  },
  java: {
    id: 7,
    name: 'java',
    label: 'Java',
    shortDescription: 'A robust object-oriented language used for backend systems and scalable applications.',
    color: '#f89820',
    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg',
  },
  python: {
    id: 8,
    name: 'python',
    label: 'Python',
    shortDescription: 'A versatile language for AI, automation, backend services, and scripting workflows.',
    color: '#3776ab',
    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg',
  },
  nodejs: {
    id: 9,
    name: 'nodejs',
    label: 'Node.js',
    shortDescription: 'A runtime environment that lets you run JavaScript on the server side.',
    color: '#6cc24a',
    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg',
  },
  express: {
    id: 10,
    name: 'express',
    label: 'Express',
    shortDescription: 'A minimal Node.js framework for creating APIs and backend services.',
    color: '#ffffff',
    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/express/express-original.svg',
  },
  mysql: {
    id: 11,
    name: 'mysql',
    label: 'MySQL',
    shortDescription: 'A widely used open-source relational database system for structured data storage.',
    color: '#4479a1',
    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg',
  },
  tailwind: {
    id: 12,
    name: 'tailwind',
    label: 'Tailwind',
    shortDescription: 'A utility-first CSS framework for rapidly building custom and responsive UI designs.',
    color: '#38bdf8',
    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-plain.svg',
  },
  git: {
    id: 13,
    name: 'git',
    label: 'Git',
    shortDescription: 'A distributed version control system for tracking source code changes.',
    color: '#f1502f',
    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg',
  },
  github: {
    id: 14,
    name: 'github',
    label: 'GitHub',
    shortDescription: 'A platform to host, manage, and collaborate on code using Git.',
    color: '#000000',
    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg',
  },
  prettier: {
    id: 15,
    name: 'prettier',
    label: 'Solidity',
    shortDescription: 'A smart contract language used to build secure decentralized applications on EVM chains.',
    color: '#6366f1',
    icon: 'https://cdn.simpleicons.org/solidity/6366f1',
  },
  npm: {
    id: 16,
    name: 'npm',
    label: 'NPM',
    shortDescription:
      'The package manager for JavaScript, used to install libraries and manage project dependencies.',
    color: '#fff',
    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/npm/npm-original-wordmark.svg',
  },
  firebase: {
    id: 17,
    name: 'firebase',
    label: 'Firebase',
    shortDescription:
      'A platform by Google offering backend services like authentication, database, and hosting.',
    color: '#ffca28',
    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/firebase/firebase-plain.svg',
  },
  blockchain: {
    id: 18,
    name: 'blockchain',
    label: 'Blockchain',
    shortDescription:
      'A distributed ledger technology that powers decentralized networks and trustless applications.',
    color: '#8b5cf6',
    icon: 'https://cdn.simpleicons.org/blockchaindotcom/8b5cf6',
  },
  figma: {
    id: 19,
    name: 'figma',
    label: 'Figma',
    shortDescription:
      'A collaborative design platform for prototyping interfaces and product workflows.',
    color: '#a855f7',
    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/figma/figma-original.svg',
  },
  docker: {
    id: 20,
    name: 'docker',
    label: 'Docker',
    shortDescription:
      'A platform for developing, shipping, and running applications in isolated containers.',
    color: '#2496ed',
    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg',
  },
  adobe: {
    id: 21,
    name: 'adobe',
    label: 'Adobe',
    shortDescription:
      'Creative tooling used for visual assets, brand systems, and design production workflows.',
    color: '#ef4444',
    icon: 'https://cdn.simpleicons.org/adobe/ef4444',
  },
  gcp: {
    id: 22,
    name: 'gcp',
    label: 'GCP',
    shortDescription:
      'Google Cloud Platform for scalable compute, storage, AI services, and cloud-native tooling.',
    color: '#4285f4',
    icon: 'https://cdn.simpleicons.org/googlecloud/4285f4',
  },
  render: {
    id: 23,
    name: 'render',
    label: 'Render',
    shortDescription:
      'A cloud platform for deploying web apps, APIs, and background services with simple CI/CD.',
    color: '#22d3ee',
    icon: 'https://cdn.simpleicons.org/render/22d3ee',
  },
  vercel: {
    id: 24,
    name: 'vercel',
    label: 'Vercel',
    shortDescription:
      'A cloud platform for deploying frontend applications, especially optimized for Next.js.',
    color: '#6cc24a',
    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vercel/vercel-original.svg',
  },
}
