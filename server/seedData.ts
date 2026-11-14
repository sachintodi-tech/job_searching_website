import type { ExperienceLevel, JobType, Niche } from './config/constants.ts';

export interface SeedJobInput {
  title: string;
  company: string;
  location: string;
  niche: Niche;
  type: JobType;
  experienceLevel: ExperienceLevel;
  salaryRange: string;
  description: string;
  requirements: string[];
  daysAgo: number;
}

export const SEED_JOBS: SeedJobInput[] = [
  {
    title: 'Senior Product Data Analyst',
    company: 'Razorpay',
    location: 'Bengaluru',
    niche: 'Data Analytics',
    type: 'Full-time',
    experienceLevel: 'Senior',
    salaryRange: '₹22L – ₹32L / yr',
    description:
      'Partner directly with checkout and merchant-onboarding product squads in Koramangala to diagnose conversion friction, run multivariate funnel experiments, and standardize merchant telemetry across India.',
    requirements: [
      '4+ years writing complex SQL (BigQuery/Presto) and Python analysis notebooks',
      'Strong command of A/B experimentation, causal inference, and cohort retention modeling',
      'Experience building executive decision dashboards in Looker or Metabase',
      'Clear written communication for product reviews with engineering and leadership',
    ],
    daysAgo: 1,
  },
  {
    title: 'Business Intelligence Analyst',
    company: 'Swiggy',
    location: 'Bengaluru',
    niche: 'Data Analytics',
    type: 'Full-time',
    experienceLevel: 'Mid Level',
    salaryRange: '₹14L – ₹20L / yr',
    description:
      'Analyze hyperlocal delivery SLA metrics, rider utilization, and city-level unit economics for Instamart dark stores across Tier-1 and Tier-2 Indian metros.',
    requirements: [
      '2–4 years in BI or supply-chain analytics in high-frequency consumer businesses',
      'Advanced SQL, dbt modeling, and Tableau or Power BI dashboard architecture',
      'Comfort turning noisy operational logs into clean weekly operating reviews',
    ],
    daysAgo: 3,
  },
  {
    title: 'Junior Risk & Fraud Analyst',
    company: 'CRED',
    location: 'Bengaluru',
    niche: 'Data Analytics',
    type: 'Full-time',
    experienceLevel: 'Entry Level',
    salaryRange: '₹10L – ₹14L / yr',
    description:
      'Monitor UPI and credit-bill payment anomalies, investigate emerging fraud rings, and tune rule precision alongside risk data scientists.',
    requirements: [
      '0–2 years of experience in SQL, Excel/Sheets, and Python pandas',
      'Strong statistical intuition and curiosity for transactional anomaly patterns',
      'Bachelor’s degree in engineering, statistics, economics, or mathematics',
    ],
    daysAgo: 5,
  },
  {
    title: 'Lead Revenue Analytics Manager',
    company: 'Zomato',
    location: 'Gurugram',
    niche: 'Data Analytics',
    type: 'Full-time',
    experienceLevel: 'Lead',
    salaryRange: '₹30L – ₹42L / yr',
    description:
      'Own pricing elasticity modeling, restaurant ads yield analytics, and annual revenue forecasting for dining-out and delivery verticals across NCR and national markets.',
    requirements: [
      '6+ years leading analytics teams in marketplace or fintech environments',
      'Deep mastery of SQL, R/Python forecasting, and stakeholder alignment',
      'Track record of mentoring 4+ analysts and shipping measurable margin gains',
    ],
    daysAgo: 7,
  },
  {
    title: 'Full-Stack Engineer (MERN)',
    company: 'Zerodha Tech',
    location: 'Bengaluru',
    niche: 'Web Development',
    type: 'Full-time',
    experienceLevel: 'Mid Level',
    salaryRange: '₹18L – ₹26L / yr',
    description:
      'Build resilient investor education and portfolio reporting web interfaces with Node.js, TypeScript, React, and PostgreSQL/MongoDB with strict latency and accessibility standards.',
    requirements: [
      '3+ years shipping production TypeScript, React, and Node.js/Express applications',
      'Solid grasp of database indexing, caching strategies, and REST API security',
      'Preference for clean, dependency-light codebases and thorough testing',
    ],
    daysAgo: 1,
  },
  {
    title: 'Senior Frontend Architect',
    company: 'Postman',
    location: 'Remote - India',
    niche: 'Web Development',
    type: 'Remote',
    experienceLevel: 'Senior',
    salaryRange: '₹28L – ₹40L / yr',
    description:
      'Architect collaborative API workspace views, virtualized request inspectors, and accessible design-system primitives used by millions of developers globally.',
    requirements: [
      '5+ years in modern React, TypeScript, state management, and browser performance profiling',
      'Deep familiarity with Web Workers, IndexedDB, and keyboard-first workflows',
      'Experience mentoring senior UI engineers across distributed squads',
    ],
    daysAgo: 2,
  },
  {
    title: 'Backend Node.js Developer',
    company: 'Groww',
    location: 'Bengaluru',
    niche: 'Web Development',
    type: 'Full-time',
    experienceLevel: 'Mid Level',
    salaryRange: '₹16L – ₹24L / yr',
    description:
      'Design high-throughput wealth-management APIs, webhook verification pipelines, and KYC document orchestration services for retail mutual-fund investors.',
    requirements: [
      '2–5 years building distributed Node.js / Express or NestJS microservices',
      'Hands-on production experience with MongoDB, Redis, and message queues',
      'Strong understanding of idempotency, rate limiting, and audit logging',
    ],
    daysAgo: 4,
  },
  {
    title: 'Frontend Engineering Intern',
    company: 'BrowserStack',
    location: 'Mumbai',
    niche: 'Web Development',
    type: 'Internship',
    experienceLevel: 'Entry Level',
    salaryRange: '₹45K – ₹60K / mo',
    description:
      'Join the Mumbai dashboard engineering team for a 6-month internship building responsive test-run analytics views and accessible React components.',
    requirements: [
      'Strong fundamentals in HTML5, CSS3, TypeScript, and React hooks',
      '2+ personal or open-source web projects with clean Git commit history',
      'Available full-time for 6 months in Mumbai or hybrid',
    ],
    daysAgo: 6,
  },
  {
    title: 'Performance Marketing Lead',
    company: 'Nykaa',
    location: 'Mumbai',
    niche: 'Digital Marketing',
    type: 'Full-time',
    experienceLevel: 'Senior',
    salaryRange: '₹18L – ₹25L / yr',
    description:
      'Scale ROAS-positive Meta, Google Search, and YouTube acquisition campaigns across D2C beauty launches while tightening attribution and LTV-to-CAC ratios.',
    requirements: [
      '4+ years managing ₹1Cr+ monthly performance budgets across Meta and Google Ads',
      'Hands-on mastery of GA4, AppsFlyer/Branch MMPs, and creative split testing',
      'Analytical rigor around contribution margin and repeat purchase cohorts',
    ],
    daysAgo: 2,
  },
  {
    title: 'SEO & Organic Growth Specialist',
    company: 'ClearTax',
    location: 'Bengaluru',
    niche: 'Digital Marketing',
    type: 'Full-time',
    experienceLevel: 'Mid Level',
    salaryRange: '₹10L – ₹15L / yr',
    description:
      'Drive organic search capture across income tax, GST, and mutual fund calculators through technical SEO audits, schema optimization, and programmatic landing pages.',
    requirements: [
      '2–4 years growing non-branded organic traffic in competitive Indian SaaS/fintech',
      'Proficiency with Search Console, Ahrefs/Semrush, Screaming Frog, and Core Web Vitals',
      'Proven ability to collaborate with editorial and engineering teams',
    ],
    daysAgo: 4,
  },
  {
    title: 'Lifecycle & CRM Marketing Manager',
    company: 'Urban Company',
    location: 'Gurugram',
    niche: 'Digital Marketing',
    type: 'Full-time',
    experienceLevel: 'Mid Level',
    salaryRange: '₹13L – ₹19L / yr',
    description:
      'Design segmented WhatsApp, push, and email retention journeys using CleverTap and MoEngage to increase repeat home-service bookings.',
    requirements: [
      '3+ years executing lifecycle automation in B2C consumer apps',
      'Experience with CleverTap, MoEngage, or WebEngage cohort triggers',
      'Strong experimentation discipline around send-time and copy lift',
    ],
    daysAgo: 6,
  },
  {
    title: 'Growth Marketing Associate',
    company: 'Lenskart',
    location: 'Delhi NCR',
    niche: 'Digital Marketing',
    type: 'Full-time',
    experienceLevel: 'Entry Level',
    salaryRange: '₹7L – ₹10L / yr',
    description:
      'Support omnichannel city campaigns, store-launch hyperlocal ads, and weekly funnel reporting across North India retail clusters.',
    requirements: [
      '1+ year in paid social, Google Ads, or agency account execution',
      'Strong Excel/Sheets modeling for CTR, CPA, and store footfall tracking',
      'Collaborative, fast-moving execution mindset',
    ],
    daysAgo: 8,
  },
  {
    title: 'Senior Product Designer',
    company: 'PhonePe',
    location: 'Bengaluru',
    niche: 'Design',
    type: 'Full-time',
    experienceLevel: 'Senior',
    salaryRange: '₹24L – ₹35L / yr',
    description:
      'Craft effortless multilingual payment and wealth flows for 500M+ users across urban and Bharat segments, balancing speed, trust, and WCAG accessibility.',
    requirements: [
      '4+ years designing end-to-end consumer mobile and web applications',
      'Portfolio demonstrating clear problem framing, systems thinking, and shipped outcomes',
      'Mastery of Figma variables, auto-layout, and design-token handoff',
    ],
    daysAgo: 1,
  },
  {
    title: 'UX Researcher & Product Strategist',
    company: 'Meesho',
    location: 'Bengaluru',
    niche: 'Design',
    type: 'Full-time',
    experienceLevel: 'Mid Level',
    salaryRange: '₹15L – ₹22L / yr',
    description:
      'Conduct field studies across Tier-2 and Tier-3 Indian cities to uncover seller catalog pain points and buyer trust signals in social commerce.',
    requirements: [
      '2–4 years leading generative and evaluative UX research in consumer tech',
      'Fluency in Hindi and English for unmoderated and moderated user interviews',
      'Ability to translate qualitative synthesis into prioritized product bets',
    ],
    daysAgo: 3,
  },
  {
    title: 'Brand & Visual Designer',
    company: 'Headspace India Studio',
    location: 'Mumbai',
    niche: 'Design',
    type: 'Contract',
    experienceLevel: 'Mid Level',
    salaryRange: '₹90K – ₹1.4L / mo',
    description:
      'Develop editorial campaign art direction, typography systems, and motion storyboards for mindfulness and workplace wellness initiatives.',
    requirements: [
      '3+ years in brand identity, editorial layout, and digital art direction',
      'Strong portfolio showcasing restrained typography and custom illustration direction',
      'Proficiency in Figma, Illustrator, and After Effects',
    ],
    daysAgo: 5,
  },
  {
    title: 'Design Systems Lead',
    company: 'Freshworks',
    location: 'Chennai',
    niche: 'Design',
    type: 'Full-time',
    experienceLevel: 'Lead',
    salaryRange: '₹32L – ₹44L / yr',
    description:
      'Lead our multi-product enterprise design system across CRM and ITSM suites, governing component accessibility, tokens, and Figma-to-React parity.',
    requirements: [
      '6+ years in UI/product design with 2+ years stewarding a multi-team design system',
      'Deep knowledge of ARIA patterns, keyboard navigation, and token architecture',
      'Track record of close partnership with frontend platform engineers',
    ],
    daysAgo: 9,
  },
  {
    title: 'FP&A Manager',
    company: 'Pine Labs',
    location: 'Noida',
    niche: 'Finance',
    type: 'Full-time',
    experienceLevel: 'Mid Level',
    salaryRange: '₹18L – ₹25L / yr',
    description:
      'Lead annual operating plan modeling, merchant POS unit-economics tracking, and monthly variance reviews for executive leadership.',
    requirements: [
      'CA or MBA Finance with 3–5 years in corporate FP&A or SaaS/fintech finance',
      'Advanced financial modeling in Excel and familiarity with NetSuite or Anaplan',
      'Sharp business partnering skills across product and revenue operations',
    ],
    daysAgo: 2,
  },
  {
    title: 'Corporate Treasury & Compliance Analyst',
    company: 'Jupiter Money',
    location: 'Mumbai',
    niche: 'Finance',
    type: 'Full-time',
    experienceLevel: 'Entry Level',
    salaryRange: '₹9L – ₹13L / yr',
    description:
      'Manage daily liquidity reconciliations, RBI partner-bank settlement reporting, and vendor payout audits for digital banking operations.',
    requirements: [
      '1–2 years in fintech treasury, statutory audit, or banking operations',
      'Strong command of reconciliation automation, GST/TDS compliance, and Excel',
      'High attention to detail and structured documentation habits',
    ],
    daysAgo: 4,
  },
  {
    title: 'Senior Venture & Strategic Finance Lead',
    company: 'Flipkart',
    location: 'Bengaluru',
    niche: 'Finance',
    type: 'Full-time',
    experienceLevel: 'Senior',
    salaryRange: '₹28L – ₹38L / yr',
    description:
      'Evaluate supply-chain capital allocation, strategic M&A opportunities, and marketplace category profitability across national fulfillment networks.',
    requirements: [
      '5+ years in investment banking, corporate finance, or tech strategic finance',
      'CA / CFA / MBA from a premier institute with proven valuation modeling rigor',
      'Executive presence for board and CFO-level investment memos',
    ],
    daysAgo: 7,
  },
  {
    title: 'Enterprise Account Executive',
    company: 'Darwinbox',
    location: 'Hyderabad',
    niche: 'Sales',
    type: 'Full-time',
    experienceLevel: 'Senior',
    salaryRange: '₹20L – ₹30L / yr + OTE',
    description:
      'Manage full-cycle enterprise SaaS sales with CHROs and CIOs across 1,000+ employee Indian conglomerates in South and West India.',
    requirements: [
      '4+ years closing ₹50L+ ACV B2B SaaS contracts in India or APAC',
      'Structured MEDDPICC or consultative enterprise discovery methodology',
      'Consistent track record of exceeding annual net-new ARR quotas',
    ],
    daysAgo: 2,
  },
  {
    title: 'Inside Sales & SDR Specialist',
    company: 'LeadSquared',
    location: 'Bengaluru',
    niche: 'Sales',
    type: 'Full-time',
    experienceLevel: 'Entry Level',
    salaryRange: '₹6L – ₹9L / yr',
    description:
      'Qualify inbound mid-market leads, run structured outbound cadences for edtech and healthcare prospects, and book high-intent discovery demos.',
    requirements: [
      '0–2 years in B2B SaaS outbound prospecting or inside sales',
      'Clear spoken and written communication in English and Hindi',
      'Comfort with HubSpot/Salesforce CRM hygiene and pipeline metrics',
    ],
    daysAgo: 5,
  },
  {
    title: 'Mid-Market Partnerships Manager',
    company: 'Cashfree Payments',
    location: 'Pune',
    niche: 'Sales',
    type: 'Full-time',
    experienceLevel: 'Mid Level',
    salaryRange: '₹14L – ₹20L / yr',
    description:
      'Build channel and agency partnerships across Maharashtra and Gujarat, onboarding D2C merchants onto payment gateway and payout APIs.',
    requirements: [
      '3+ years in fintech B2B sales, merchant acquiring, or channel partnerships',
      'Ability to explain API integration value clearly to founders and CFOs',
      'Willingness to travel regionally within West India as needed',
    ],
    daysAgo: 6,
  },
  {
    title: 'Technical Talent Acquisition Partner',
    company: 'Atlassian India',
    location: 'Bengaluru',
    niche: 'HR',
    type: 'Full-time',
    experienceLevel: 'Mid Level',
    salaryRange: '₹15L – ₹22L / yr',
    description:
      'Lead full-cycle engineering and product hiring for platform teams in Bengaluru, focusing on inclusive sourcing, structured rubrics, and candidate experience.',
    requirements: [
      '3+ years recruiting software engineers and data specialists in product tech companies',
      'Experience with Greenhouse/Lever ATS and structured competency interviewing',
      'Strong market intelligence on Indian engineering compensation benchmarks',
    ],
    daysAgo: 1,
  },
  {
    title: 'HR Business Partner',
    company: 'Zoho',
    location: 'Chennai',
    niche: 'HR',
    type: 'Full-time',
    experienceLevel: 'Senior',
    salaryRange: '₹18L – ₹26L / yr',
    description:
      'Partner with engineering and customer-success directors on organizational design, manager coaching, appraisal fairness, and employee retention.',
    requirements: [
      '4+ years as an HRBP in scaling technology or SaaS organizations',
      'Deep grounding in Indian labor compliance, performance frameworks, and ER',
      'Empathetic yet objective advisory approach with senior leadership',
    ],
    daysAgo: 4,
  },
  {
    title: 'People Operations Specialist',
    company: 'Slice',
    location: 'Remote - India',
    niche: 'HR',
    type: 'Remote',
    experienceLevel: 'Entry Level',
    salaryRange: '₹7L – ₹10L / yr',
    description:
      'Manage seamless remote onboarding, HRMS data integrity, benefits administration, and monthly payroll inputs for distributed teams across India.',
    requirements: [
      '1–2 years in People Ops, HR shared services, or payroll coordination',
      'Familiarity with Keka, Darwinbox, or Rippling HRIS platforms',
      'Process-driven mindset with strong empathy for employee queries',
    ],
    daysAgo: 8,
  },
  {
    title: 'Senior Technical Writer',
    company: 'Hasura',
    location: 'Remote - India',
    niche: 'Content Writing',
    type: 'Remote',
    experienceLevel: 'Senior',
    salaryRange: '₹18L – ₹27L / yr',
    description:
      'Author crystal-clear API documentation, migration guides, and architectural tutorials for backend developers using GraphQL and PostgreSQL.',
    requirements: [
      '4+ years writing developer documentation, SDK guides, or technical blogs',
      'Comfort reading TypeScript/SQL snippets and working directly with Git/Markdown',
      'Portfolio of clear, jargon-free documentation shipped to developer audiences',
    ],
    daysAgo: 2,
  },
  {
    title: 'Editorial & Product Copywriter',
    company: 'Kuku FM',
    location: 'Mumbai',
    niche: 'Content Writing',
    type: 'Full-time',
    experienceLevel: 'Mid Level',
    salaryRange: '₹10L – ₹15L / yr',
    description:
      'Shape crisp UX microcopy, retention narratives, and editorial show descriptions that resonate with listeners across Hindi and regional audio formats.',
    requirements: [
      '2–4 years in consumer product copywriting, UX writing, or digital editorial',
      'Exceptional command of tone, brevity, and culturally grounded storytelling',
      'Experience partnering with product designers in Figma',
    ],
    daysAgo: 5,
  },
  {
    title: 'B2B SaaS Content Strategist',
    company: 'Chargebee',
    location: 'Chennai',
    niche: 'Content Writing',
    type: 'Part-time',
    experienceLevel: 'Mid Level',
    salaryRange: '₹70K – ₹1.0L / mo',
    description:
      'Research and write deeply researched CFO playbooks, subscription billing benchmarks, and customer case studies with verified ROI metrics.',
    requirements: [
      '3+ years writing long-form B2B SaaS or fintech research content',
      'Ability to interview product leaders and synthesize quantitative takeaways',
      'Clean editorial polish with zero fluff',
    ],
    daysAgo: 7,
  },
];
