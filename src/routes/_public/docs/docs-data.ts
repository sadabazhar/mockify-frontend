// ─── Navigation Structure ────────────────────────────────────────────────────

export interface DocSection {
  id: string;
  title: string;
  icon: string;
  pages: DocPage[];
}

export interface DocPage {
  id: string;
  title: string;
  sectionId: string;
  description?: string;
}

export const DOC_SECTIONS: DocSection[] = [
  {
    id: 'getting-started',
    title: 'Getting Started',
    icon: 'Rocket',
    pages: [
      { id: 'introduction', title: 'Introduction', sectionId: 'getting-started', description: 'What is Mockify and why use it' },
      { id: 'quickstart', title: 'Quickstart', sectionId: 'getting-started', description: 'Get your first mock endpoint in 5 minutes' },
      { id: 'core-concepts', title: 'Core Concepts', sectionId: 'getting-started', description: 'Key ideas you need to understand' },
    ],
  },
  {
    id: 'authentication',
    title: 'Authentication',
    icon: 'Lock',
    pages: [
      { id: 'creating-account', title: 'Creating an Account', sectionId: 'authentication' },
      { id: 'login-sessions', title: 'Login & Sessions', sectionId: 'authentication' },
      { id: 'password-reset', title: 'Password Reset', sectionId: 'authentication' },
    ],
  },
  {
    id: 'organizations',
    title: 'Organizations',
    icon: 'Building2',
    pages: [
      { id: 'creating-organization', title: 'Creating an Organization', sectionId: 'organizations' },
      { id: 'organization-settings', title: 'Organization Settings', sectionId: 'organizations' },
    ],
  },
  {
    id: 'team-collaboration',
    title: 'Team Collaboration',
    icon: 'Users',
    pages: [
      { id: 'inviting-members', title: 'Inviting Team Members', sectionId: 'team-collaboration' },
      { id: 'roles-permissions', title: 'Roles & Permissions', sectionId: 'team-collaboration' },
      { id: 'managing-members', title: 'Managing Members', sectionId: 'team-collaboration' },
    ],
  },
  {
    id: 'projects',
    title: 'Projects',
    icon: 'FolderOpen',
    pages: [
      { id: 'creating-project', title: 'Creating a Project', sectionId: 'projects' },
      { id: 'project-settings', title: 'Project Settings', sectionId: 'projects' },
      { id: 'project-access', title: 'Project Access Control', sectionId: 'projects' },
    ],
  },
  {
    id: 'api-keys',
    title: 'API Keys',
    icon: 'Key',
    pages: [
      { id: 'generating-api-keys', title: 'Generating API Keys', sectionId: 'api-keys' },
      { id: 'rate-limits', title: 'Rate Limits & Expiry', sectionId: 'api-keys' },
      { id: 'permission-scopes', title: 'Permission Scopes', sectionId: 'api-keys' },
      { id: 'key-security', title: 'Key Security', sectionId: 'api-keys' },
    ],
  },
  {
    id: 'schemas',
    title: 'Schemas',
    icon: 'FileJson',
    pages: [
      { id: 'what-is-schema', title: 'What Is a Schema?', sectionId: 'schemas' },
      { id: 'creating-schema', title: 'Creating Your First Schema', sectionId: 'schemas' },
      { id: 'field-types', title: 'Field Types & Validation', sectionId: 'schemas' },
    ],
  },
  {
    id: 'mock-endpoints',
    title: 'Mock Endpoints',
    icon: 'Globe',
    pages: [
      { id: 'endpoint-structure', title: 'Endpoint URL Structure', sectionId: 'mock-endpoints' },
      { id: 'http-methods', title: 'Supported HTTP Methods', sectionId: 'mock-endpoints' },
      { id: 'using-api-key', title: 'Authenticating Requests', sectionId: 'mock-endpoints' },
      { id: 'error-simulation', title: 'Error Simulation', sectionId: 'mock-endpoints' },
    ],
  },
  {
    id: 'troubleshooting',
    title: 'Troubleshooting',
    icon: 'LifeBuoy',
    pages: [
      { id: 'common-errors', title: 'Common Errors', sectionId: 'troubleshooting' },
      { id: 'api-key-issues', title: 'API Key Issues', sectionId: 'troubleshooting' },
      { id: 'permission-errors', title: 'Permission Errors', sectionId: 'troubleshooting' },
    ],
  },
];

// ─── Page Content ─────────────────────────────────────────────────────────────

export type ContentBlock =
  | { type: 'h2'; text: string }
  | { type: 'h3'; text: string }
  | { type: 'p'; text: string }
  | { type: 'callout'; variant: 'info' | 'warning' | 'danger' | 'tip'; title: string; text: string }
  | { type: 'code'; lang: string; label?: string; code: string }
  | { type: 'steps'; items: { title: string; text: string }[] }
  | { type: 'table'; headers: string[]; rows: string[][] }
  | { type: 'divider' };

export interface PageContent {
  id: string;
  sectionId: string;
  title: string;
  description: string;
  content: ContentBlock[];
  prev?: { id: string; sectionId: string; title: string };
  next?: { id: string; sectionId: string; title: string };
}

export const PAGE_CONTENT: Record<string, PageContent> = {

  // ── Introduction ──────────────────────────────────────────────────────────
  introduction: {
    id: 'introduction',
    sectionId: 'getting-started',
    title: 'Introduction to Mockify',
    description: 'Learn what Mockify is, who it\'s for, and how it fits into your development workflow.',
    next: { id: 'quickstart', sectionId: 'getting-started', title: 'Quickstart' },
    content: [
      {
        type: 'p',
        text: 'Mockify is a SaaS API mocking platform built for frontend developers who need a reliable backend to build against — before the real one exists. Instead of coordinating with backend teams or writing your own mock server, Mockify lets you define data schemas, generate realistic mock data, and access it through secure, authenticated REST endpoints in minutes.',
      },
      { type: 'h2', text: 'Who is Mockify for?' },
      { type: 'p', text: 'Mockify is designed for three kinds of users:' },
      {
        type: 'table',
        headers: ['Persona', 'Use Case'],
        rows: [
          ['Solo Developer', 'Build and prototype frontends without setting up a backend'],
          ['Frontend Team', 'Develop against a shared, versioned mock API across the team'],
          ['Team Lead / Owner', 'Manage access, invite developers, and control API key permissions'],
        ],
      },
      { type: 'h2', text: 'How it works' },
      { type: 'p', text: 'The Mockify workflow has four core steps:' },
      {
        type: 'steps',
        items: [
          { title: 'Define a Schema', text: 'Describe the shape of your data — fields, types, and constraints — using Mockify\'s schema builder.' },
          { title: 'Generate Mock Data', text: 'Mockify generates realistic, paginated mock records based on your schema.' },
          { title: 'Create an API Key', text: 'Generate a scoped API key with the exact permissions your frontend needs.' },
          { title: 'Hit your Endpoints', text: 'Access your mock data via standard REST endpoints, exactly like a real API.' },
        ],
      },
      { type: 'h2', text: 'Key features' },
      { type: 'p', text: 'Mockify gives you everything you need to develop frontend applications independently:' },
      {
        type: 'table',
        headers: ['Feature', 'Description'],
        rows: [
          ['Organizations & Projects', 'Group work by team and project, with isolated data per project'],
          ['Role-Based Access Control', 'Owner, Admin, Developer, and Viewer roles with fine-grained permissions'],
          ['API Key Scopes', 'Limit keys to specific organizations, projects, schemas, or resources'],
          ['Rate Limits & Expiry', 'Set per-key rate limits and expiration dates for security'],
          ['Realistic Mock Data', 'Generate names, emails, dates, numbers, and custom fields'],
          ['Standard REST API', 'GET, POST, PUT, PATCH, DELETE — all HTTP methods supported'],
        ],
      },
      {
        type: 'callout',
        variant: 'tip',
        title: 'Ready to start?',
        text: 'Follow the Quickstart guide to get a working mock endpoint in under 5 minutes.',
      },
    ],
  },

  // ── Quickstart ────────────────────────────────────────────────────────────
  quickstart: {
    id: 'quickstart',
    sectionId: 'getting-started',
    title: 'Quickstart',
    description: 'Get your first mock endpoint up and running in under 5 minutes.',
    prev: { id: 'introduction', sectionId: 'getting-started', title: 'Introduction' },
    next: { id: 'core-concepts', sectionId: 'getting-started', title: 'Core Concepts' },
    content: [
      { type: 'p', text: 'This guide walks you through every step from account creation to making your first authenticated API request. You\'ll have a working mock endpoint by the end.' },
      {
        type: 'callout',
        variant: 'info',
        title: 'Prerequisites',
        text: 'No prerequisites required. You just need a browser and an email address.',
      },
      { type: 'h2', text: 'Step 1 — Create your account' },
      { type: 'p', text: 'Go to the Mockify registration page and sign up with your email and password. You\'ll receive a verification email — click the link to activate your account.' },
      { type: 'h2', text: 'Step 2 — Create an organization' },
      { type: 'p', text: 'After logging in, create your first organization. An organization is the top-level container for all your projects. Give it a name like "Xyz Corp" or your own name if working solo.' },
      { type: 'h2', text: 'Step 3 — Create a project' },
      { type: 'p', text: 'Inside your organization, create a project. Projects group related schemas together. Name it after your application — for example, "E-Commerce App" or "Dashboard Frontend".' },
      { type: 'h2', text: 'Step 4 — Define a schema' },
      { type: 'p', text: 'Navigate to your project and create a schema. For this quickstart, we\'ll create a simple User schema.' },
      {
        type: 'code',
        lang: 'json',
        label: 'Example: User Schema',
        code: `{
  "name": "User",
  "schemaJson": {
    "id": "uuid",
    "name": "string",
    "email": "email",
    "age": "number",
    "isActive": "boolean",
    "createdAt": "datetime"
  }
}`,
      },
      { type: 'h2', text: 'Step 5 — Generate mock data' },
      { type: 'p', text: 'With your schema defined, generate mock records. Create custom records manually or click Generate to create them automatically. Mockify will populate your schema with realistic data.' },
      { type: 'h2', text: 'Step 6 — Create an API key' },
      { type: 'p', text: 'Go to your organization\'s API Keys page and create a new key. For now, give it project-level scope targeting your new project. Copy the key — it\'s only shown once.' },
      {
        type: 'callout',
        variant: 'warning',
        title: 'Save your API key now',
        text: 'Mockify only displays your API key once at creation time. Store it somewhere safe immediately — you cannot retrieve it later, only rotate or revoke it.',
      },
      { type: 'h2', text: 'Step 7 — Make your first request' },
      { type: 'p', text: 'Use your API key to access your mock data. Pass it in the Authorization header as a Bearer token.' },
      {
        type: 'code',
        lang: 'bash',
        label: 'cURL',
        code: `curl https://mockify.dev/api/{orgSlug}/{projectSlug}/users/records
  -H "Authorization: Bearer mk_live_your_api_key_here"`,
      },
      {
        type: 'code',
        lang: 'javascript',
        label: 'JavaScript (fetch)',
        code: `const response = await fetch(
  'https://mockify.dev/api/{orgSlug}/{projectSlug}/users/records',
  {
    headers: {
      'Authorization': 'Bearer mk_live_your_api_key_here',
      'Content-Type': 'application/json',
    },
  }
);

const records = await response.json();
console.log(records); // Array of 50 mock User objects`,
      },
      {
        type: 'code',
        lang: 'json',
        label: 'Response',
        code: `{
  "data": [
    {
      "id": "a3f4c2d1-...",
      "name": "Xyz User",
      "email": "xyz.user@example.com",
      "age": 30,
      "isActive": true,
      "createdAt": "2024-03-12T08:45:00Z"
    }
    // ... 49 more records
  ],
  "page": 1,
  "size": 50,
  "totalElements": 50,
  "totalPages": 1
}`,
      },
      {
        type: 'callout',
        variant: 'tip',
        title: 'You\'re done!',
        text: 'You now have a fully functional mock API endpoint. From here, explore schemas with nested fields, set up team access, or configure advanced API key scopes.',
      },
    ],
  },

  // ── Core Concepts ─────────────────────────────────────────────────────────
  'core-concepts': {
    id: 'core-concepts',
    sectionId: 'getting-started',
    title: 'Core Concepts',
    description: 'Understand the key building blocks of Mockify before diving deeper.',
    prev: { id: 'quickstart', sectionId: 'getting-started', title: 'Quickstart' },
    next: { id: 'creating-account', sectionId: 'authentication', title: 'Creating an Account' },
    content: [
      { type: 'p', text: 'Mockify is built around a hierarchy of resources. Understanding how they relate to each other makes everything else click.' },
      { type: 'h2', text: 'Resource Hierarchy' },
      {
        type: 'table',
        headers: ['Resource', 'Description', 'Scope'],
        rows: [
          ['Organization', 'Top-level container. Represents a company, team, or individual.', 'Global'],
          ['Project', 'A logical grouping of schemas within an organization. Usually maps to one application.', 'Per Organization'],
          ['Schema', 'The data model definition — describes the shape and types of your mock data.', 'Per Project'],
          ['API Key', 'A credential used to authenticate requests. Can be scoped to any level of the hierarchy.', 'Per Organization'],
        ],
      },
      { type: 'h2', text: 'Organizations' },
      { type: 'p', text: 'An organization is the root of everything in Mockify. It holds your projects, team members, and API keys. You can belong to multiple organizations — for example, your personal work and a client project.' },
      { type: 'h2', text: 'Projects' },
      { type: 'p', text: 'Projects sit inside organizations and group related schemas. Each project gets its own namespace in the API URL, so data is fully isolated between projects.' },
      { type: 'h2', text: 'Schemas' },
      { type: 'p', text: 'A schema defines what your mock data looks like. It\'s a list of named fields, each with a type. Mockify uses the schema to generate realistic data. You can think of a schema like a database table or a TypeScript interface.' },
      { type: 'h2', text: 'API Keys' },
      { type: 'p', text: 'API keys are the credentials your frontend uses to authenticate requests to Mockify endpoints. A key can be scoped to an entire organization, a specific project, a specific schema, or even a specific resource type. The narrower the scope, the more secure.' },
      { type: 'h2', text: 'Roles' },
      { type: 'p', text: 'Every member of an organization has a role that controls what they can do:' },
      {
        type: 'table',
        headers: ['Role', 'Can Do'],
        rows: [
          ['Owner', 'Full control. Manage billing, delete org, transfer ownership.'],
          ['Admin', 'Manage members, projects, schemas, and API keys.'],
          ['Developer', 'Create and edit schemas, generate mock data, view API keys.'],
          ['Viewer', 'Read-only access to projects and schemas.'],
        ],
      },
    ],
  },

  // ── Creating Account ──────────────────────────────────────────────────────
  'creating-account': {
    id: 'creating-account',
    sectionId: 'authentication',
    title: 'Creating an Account',
    description: 'How to sign up for Mockify and verify your email.',
    prev: { id: 'core-concepts', sectionId: 'getting-started', title: 'Core Concepts' },
    next: { id: 'login-sessions', sectionId: 'authentication', title: 'Login & Sessions' },
    content: [
      { type: 'p', text: 'Signing up for Mockify takes under a minute. All you need is an email address and a password.' },
      { type: 'h2', text: 'Registration' },
      {
        type: 'steps',
        items: [
          { title: 'Go to the registration page', text: 'Navigate to /register or click "Get Started" on the homepage.' },
          { title: 'Enter your details', text: 'Provide your full name, email address, and a password of at least 8 characters.' },
          { title: 'Submit the form', text: 'Click "Create Account". A verification email will be sent immediately.' },
          { title: 'Verify your email', text: 'Open the email from Mockify and click the verification link. Links expire after 24 hours.' },
          { title: 'You\'re in', text: 'After verification, you\'ll be redirected to the dashboard where you can create your first organization.' },
        ],
      },
      {
        type: 'callout',
        variant: 'info',
        title: 'Didn\'t receive the email?',
        text: 'Check your spam folder first. If it\'s not there after a few minutes, you can request a new verification email from the login page.',
      },
      { type: 'h2', text: 'Password requirements' },
      {
        type: 'table',
        headers: ['Requirement', 'Details'],
        rows: [
          ['Minimum length', '8 characters'],
          ['Complexity', 'Mix of letters and numbers recommended'],
          ['Reuse', 'Cannot reuse your last passwords'],
        ],
      },
    ],
  },

  // ── Login & Sessions ───────────────────────────────────────────────────────
  'login-sessions': {
    id: 'login-sessions',
    sectionId: 'authentication',
    title: 'Login & Sessions',
    description: 'How authentication sessions work in Mockify.',
    prev: { id: 'creating-account', sectionId: 'authentication', title: 'Creating an Account' },
    next: { id: 'password-reset', sectionId: 'authentication', title: 'Password Reset' },
    content: [
      { type: 'p', text: 'Mockify uses secure, server-managed sessions. When you log in, a session token is issued and stored in an HTTP-only cookie — it\'s never accessible to JavaScript, protecting against XSS attacks.' },
      { type: 'h2', text: 'Logging in' },
      { type: 'p', text: 'Go to /login and enter your email and password. If your credentials are correct, you\'ll be redirected to your dashboard. If you have two-factor authentication enabled, you\'ll be prompted for your code first.' },
      { type: 'h2', text: 'Session duration' },
      {
        type: 'table',
        headers: ['Scenario', 'Duration'],
        rows: [
          ['Standard login', '7 days (rolling)'],
          ['"Remember me" checked', '30 days (rolling)'],
          ['Idle timeout', '24 hours of inactivity'],
        ],
      },
      { type: 'h2', text: 'Logging out' },
      { type: 'p', text: 'Click your avatar in the top-right and select "Log out". This immediately invalidates your session on the server — the cookie is cleared and cannot be reused.' },
      {
        type: 'callout',
        variant: 'warning',
        title: 'Shared computers',
        text: 'Always log out explicitly when using a shared or public computer. Closing the browser tab does not end your session.',
      },
    ],
  },

  // ── Password Reset ────────────────────────────────────────────────────────
  'password-reset': {
    id: 'password-reset',
    sectionId: 'authentication',
    title: 'Password Reset',
    description: 'How to reset your password if you\'ve forgotten it.',
    prev: { id: 'login-sessions', sectionId: 'authentication', title: 'Login & Sessions' },
    next: { id: 'creating-organization', sectionId: 'organizations', title: 'Creating an Organization' },
    content: [
      { type: 'p', text: 'If you\'ve forgotten your password, you can reset it via email.' },
      {
        type: 'steps',
        items: [
          { title: 'Go to the login page', text: 'Navigate to /login and click "Forgot password?".' },
          { title: 'Enter your email', text: 'Type the email address associated with your Mockify account.' },
          { title: 'Check your email', text: 'A password reset link will be sent within a few minutes.' },
          { title: 'Set a new password', text: 'Click the link in the email and enter your new password. Reset links expire after 1 hour.' },
          { title: 'Log in', text: 'Use your new password to log in. All existing sessions are invalidated.' },
        ],
      },
      {
        type: 'callout',
        variant: 'danger',
        title: 'Reset link expired?',
        text: 'Reset links are single-use and expire after 1 hour. If yours has expired, simply return to /login and request a new one.',
      },
    ],
  },

  // ── Creating Organization ─────────────────────────────────────────────────
  'creating-organization': {
    id: 'creating-organization',
    sectionId: 'organizations',
    title: 'Creating an Organization',
    description: 'Set up your first organization to start managing projects and team members.',
    prev: { id: 'password-reset', sectionId: 'authentication', title: 'Password Reset' },
    next: { id: 'organization-settings', sectionId: 'organizations', title: 'Organization Settings' },
    content: [
      { type: 'p', text: 'An organization is the top-level container in Mockify. Everything — projects, schemas, API keys, and team members — belongs to an organization. You must create one before you can do anything else.' },
      { type: 'h2', text: 'Creating your organization' },
      {
        type: 'steps',
        items: [
          { title: 'Open the Organizations page', text: 'From the dashboard, navigate to Organizations in the sidebar.' },
          { title: 'Click "New Organization"', text: 'You\'ll see a dialog asking for your organization\'s details.' },
          { title: 'Enter a name', text:  'This name is for display only. A slug will be automatically generated from the organization name in lowercase and used in API URLs, using only hyphens (e.g., "xyz-corp").'},
          { title: 'Submit', text: 'Click Create. You\'re now the Owner of this organization.' },
        ],
      },
      {
        type: 'callout',
        variant: 'warning',
        title: 'Slugs cannot be changed',
        text: 'Your organization slug is used in all API endpoint URLs. Once set, it cannot be changed without breaking existing integrations.',
      },
      { type: 'h2', text: 'Organization limits' },
      {
        type: 'table',
        headers: ['Plan', 'Organizations', 'Members per Org', 'Projects per Org'],
        rows: [
          ['Free', '3', '10', '10'],
          ['Pro', '10', '50', 'Unlimited'],
          ['Enterprise', 'Unlimited', 'Unlimited', 'Unlimited'],
        ],
      },
    ],
  },

  // ── Organization Settings ─────────────────────────────────────────────────
  'organization-settings': {
    id: 'organization-settings',
    sectionId: 'organizations',
    title: 'Organization Settings',
    description: 'Configure your organization\'s name, slug, and other settings.',
    prev: { id: 'creating-organization', sectionId: 'organizations', title: 'Creating an Organization' },
    next: { id: 'inviting-members', sectionId: 'team-collaboration', title: 'Inviting Team Members' },
    content: [
      { type: 'p', text: 'Organization settings are accessible to Owners and Admins. Go to your organization and click the Settings tab.' },
      { type: 'h2', text: 'General settings' },
      {
        type: 'table',
        headers: ['Setting', 'Who Can Edit', 'Notes'],
        rows: [
          ['Display name', 'Owner, Admin', 'Shown in the UI only'],
          ['Description', 'Owner, Admin', 'Optional. Shown to members on the org page'],
          ['Avatar / Logo', 'Owner, Admin', 'PNG or JPG, max 2MB'],
        ],
      },
      { type: 'h2', text: 'Danger zone' },
      { type: 'p', text: 'The Danger Zone section of Settings contains irreversible actions. These require Owner-level access.' },
      {
        type: 'callout',
        variant: 'danger',
        title: 'Deleting an organization is permanent',
        text: 'Deleting an organization immediately deletes all its projects, schemas, mock data, and API keys. This action cannot be undone. Export any data you need before proceeding.',
      },
    ],
  },

  // ── Inviting Members ──────────────────────────────────────────────────────
  'inviting-members': {
    id: 'inviting-members',
    sectionId: 'team-collaboration',
    title: 'Inviting Team Members',
    description: 'Add developers, admins, and viewers to your organization.',
    prev: { id: 'organization-settings', sectionId: 'organizations', title: 'Organization Settings' },
    next: { id: 'roles-permissions', sectionId: 'team-collaboration', title: 'Roles & Permissions' },
    content: [
      { type: 'p', text: 'Owners and Admins can invite new members to an organization. Invitations are sent via email and expire after 7 days.' },
      { type: 'h2', text: 'Sending an invitation' },
      {
        type: 'steps',
        items: [
          { title: 'Go to your organization', text: 'Navigate to Organizations → [Your Org] → Members.' },
          { title: 'Click "Invite Member"', text: 'A dialog will appear asking for the invitee\'s email and role.' },
          { title: 'Choose a role', text: 'Select the appropriate role — Developer is the right choice for most team members.' },
          { title: 'Send the invite', text: 'The invitee receives an email with a link to accept. If they don\'t have an account yet, they\'ll be prompted to create one first.' },
        ],
      },
      {
        type: 'callout',
        variant: 'info',
        title: 'Inviting Admins',
        text: 'Only Owners can invite someone as an Admin. Admins can then invite Developers and Viewers, but cannot promote others to Admin.',
      },
      { type: 'h2', text: 'Pending invitations' },
      { type: 'p', text: 'You can see all pending invitations in the Members tab. From there you can resend or cancel an invitation before it\'s accepted.' },
    ],
  },

  // ── Roles & Permissions ───────────────────────────────────────────────────
  'roles-permissions': {
    id: 'roles-permissions',
    sectionId: 'team-collaboration',
    title: 'Roles & Permissions',
    description: 'A full breakdown of what each role can and cannot do.',
    prev: { id: 'inviting-members', sectionId: 'team-collaboration', title: 'Inviting Team Members' },
    next: { id: 'managing-members', sectionId: 'team-collaboration', title: 'Managing Members' },
    content: [
      { type: 'p', text: 'Mockify uses Role-Based Access Control (RBAC) at the organization level. Every member has exactly one role, which determines what actions they can perform.' },
      { type: 'h2', text: 'Role overview' },
      {
        type: 'table',
        headers: ['Role', 'Intended For', 'Key Capability'],
        rows: [
          ['Owner', 'The person who created the org or was transferred ownership', 'Full control, including billing and deletion'],
          ['Admin', 'Senior developers or team leads', 'Manage members, projects, and API keys'],
          ['Developer', 'Developers working on frontend projects', 'Create schemas, generate data, view (not create) API keys'],
          ['Viewer', 'Stakeholders, QA, or read-only observers', 'Read-only access to projects and schemas'],
        ],
      },
      { type: 'h2', text: 'Permissions matrix' },
      {
        type: 'table',
        headers: ['Action', 'Owner', 'Admin', 'Developer', 'Viewer'],
        rows: [
          ['View projects & schemas', '✅', '✅', '✅', '✅'],
          ['Create / edit schemas', '✅', '✅', '✅', '❌'],
          ['Generate mock data', '✅', '✅', '✅', '❌'],
          ['Create projects', '✅', '✅', '❌', '❌'],
          ['Invite members', '✅', '✅', '❌', '❌'],
          ['Create API keys', '✅', '✅', '❌', '❌'],
          ['Revoke API keys', '✅', '✅', '❌', '❌'],
          ['Edit org settings', '✅', '✅', '❌', '❌'],
          ['Promote to Admin', '✅', '❌', '❌', '❌'],
          ['Delete organization', '✅', '❌', '❌', '❌'],
          ['Transfer ownership', '✅', '❌', '❌', '❌'],
        ],
      },
      {
        type: 'callout',
        variant: 'tip',
        title: 'Principle of least privilege',
        text: 'Assign the minimum role needed. Most developers only need the Developer role — they can do everything code-related without accessing billing or member management.',
      },
    ],
  },

  // ── Managing Members ──────────────────────────────────────────────────────
  'managing-members': {
    id: 'managing-members',
    sectionId: 'team-collaboration',
    title: 'Managing Members',
    description: 'Change roles, remove members, and transfer ownership.',
    prev: { id: 'roles-permissions', sectionId: 'team-collaboration', title: 'Roles & Permissions' },
    next: { id: 'creating-project', sectionId: 'projects', title: 'Creating a Project' },
    content: [
      { type: 'p', text: 'You can manage existing members from the Members tab of your organization. Owners and Admins can change member roles and remove members.' },
      { type: 'h2', text: 'Changing a member\'s role' },
      { type: 'p', text: 'Click the role badge next to a member\'s name and select a new role. Changes take effect immediately. Note: only Owners can assign the Admin role.' },
      { type: 'h2', text: 'Removing a member' },
      { type: 'p', text: 'Click the actions menu (⋯) next to a member and select "Remove from organization". The member loses access immediately. Any API keys they created remain active — you\'ll need to revoke those separately if needed.' },
      { type: 'h2', text: 'Transferring ownership' },
      { type: 'p', text: 'Only the current Owner can transfer ownership to another member. Go to Settings → Transfer Ownership. Select the target member and confirm. The previous owner becomes an Admin.' },
      {
        type: 'callout',
        variant: 'warning',
        title: 'You cannot remove yourself as Owner',
        text: 'Transfer ownership to someone else first, then ask the new Owner to remove you if needed.',
      },
    ],
  },

  // ── Creating Project ──────────────────────────────────────────────────────
  'creating-project': {
    id: 'creating-project',
    sectionId: 'projects',
    title: 'Creating a Project',
    description: 'How to create and configure a project inside an organization.',
    prev: { id: 'managing-members', sectionId: 'team-collaboration', title: 'Managing Members' },
    next: { id: 'project-settings', sectionId: 'projects', title: 'Project Settings' },
    content: [
      { type: 'p', text: 'Projects are where your schemas and mock data live. Each project maps to one frontend application or service.' },
      { type: 'h2', text: 'Creating a project' },
      {
        type: 'steps',
        items: [
          { title: 'Go to your organization', text: 'Navigate to Organizations → [Your Org].' },
          { title: 'Click "New Project"', text: 'A form will appear asking for the project details.' },
          { title: 'Enter a name', text: 'This name is for display only. A slug will be automatically generated from the project name in lowercase and used in API URLs, using only hyphens (e.g., "xyz-corp").' },
          { title: 'Add a description (optional)', text: 'A short description helps team members understand what this project is for.' },
          { title: 'Click Create', text: 'Your project is created and you\'re taken directly to it.' },
        ],
      },
      {
        type: 'callout',
        variant: 'info',
        title: 'Only Admins and Owners can create projects',
        text: 'Developers can work within existing projects but cannot create new ones. If you need a new project, contact your organization Admin.',
      },
      { type: 'h2', text: 'Project URL structure' },
      { type: 'p', text: 'Every project gets a namespace in the Mockify API:' },
      {
        type: 'code',
        lang: 'text',
        label: 'Base URL Pattern',
        code: `https://mockify.dev/api/{orgSlug}/{projectSlug}`,
      },
    ],
  },

  // ── Project Settings ──────────────────────────────────────────────────────
  'project-settings': {
    id: 'project-settings',
    sectionId: 'projects',
    title: 'Project Settings',
    description: 'Configure and manage an existing project.',
    prev: { id: 'creating-project', sectionId: 'projects', title: 'Creating a Project' },
    next: { id: 'project-access', sectionId: 'projects', title: 'Project Access Control' },
    content: [
      { type: 'p', text: 'Project settings are available to Owners and Admins. From a project page, click the Settings tab.' },
      { type: 'h2', text: 'Editable settings' },
      {
        type: 'table',
        headers: ['Setting', 'Notes'],
        rows: [
          ['Display name', 'Can be changed at any time'],
          ['Description', 'Optional, visible to all org members'],
          ['Archive project', 'Hides the project from default views. Data and endpoints remain active.'],
          ['Delete project', 'Permanent. Deletes all schemas, mock data, and invalidates project-scoped API keys.'],
        ],
      },
      {
        type: 'callout',
        variant: 'danger',
        title: 'Deleting a project cannot be undone',
        text: 'Export your schema definitions and any important mock data before deleting a project.',
      },
    ],
  },

  // ── Project Access ────────────────────────────────────────────────────────
  'project-access': {
    id: 'project-access',
    sectionId: 'projects',
    title: 'Project Access Control',
    description: 'How project-level access is controlled through API key scopes.',
    prev: { id: 'project-settings', sectionId: 'projects', title: 'Project Settings' },
    next: { id: 'generating-api-keys', sectionId: 'api-keys', title: 'Generating API Keys' },
    content: [
      { type: 'p', text: 'Project access is controlled at the API key level, not the user level. All org members can see all projects within that org based on their role. To restrict programmatic access to a specific project, create a project-scoped API key.' },
      { type: 'h2', text: 'How it works' },
      { type: 'p', text: 'When you create an API key with project-level scope, that key can only access endpoints within the specified project. It cannot access other projects in the same organization, even if they exist.' },
      {
        type: 'callout',
        variant: 'tip',
        title: 'One key per frontend app',
        text: 'Best practice is to create a separate project-scoped API key for each frontend application. This way, if a key is leaked, the blast radius is limited to one project.',
      },
    ],
  },

  // ── Generating API Keys ───────────────────────────────────────────────────
  'generating-api-keys': {
    id: 'generating-api-keys',
    sectionId: 'api-keys',
    title: 'Generating API Keys',
    description: 'Create and configure API keys for accessing mock endpoints.',
    prev: { id: 'project-access', sectionId: 'projects', title: 'Project Access Control' },
    next: { id: 'rate-limits', sectionId: 'api-keys', title: 'Rate Limits & Expiry' },
    content: [
      { type: 'p', text: 'API keys are the credentials your application uses to authenticate with Mockify endpoints. Only Owners and Admins can create API keys.' },
      { type: 'h2', text: 'Creating an API key' },
      {
        type: 'steps',
        items: [
          { title: 'Navigate to API Keys', text: 'Go to Organizations → [Your Org] → API Keys.' },
          { title: 'Click "Generate Key"', text: 'A dialog will appear with the key configuration options.' },
          { title: 'Name your key', text: 'Use a descriptive name that identifies the consuming application (e.g. "Dashboard Frontend – Dev").' },
          { title: 'Set scope', text: 'Choose the appropriate scope. See Permission Scopes for guidance.' },
          { title: 'Configure rate limit and expiry', text: 'Optionally set a per-minute rate limit and an expiration date.' },
          { title: 'Generate', text: 'Click Generate. Your key is shown once — copy it immediately.' },
        ],
      },
      {
        type: 'callout',
        variant: 'danger',
        title: 'Store your key immediately',
        text: 'Mockify stores only a hashed version of your API key. The plaintext key is shown exactly once. If you lose it, you must rotate the key.',
      },
      { type: 'h2', text: 'API key format' },
      { type: 'p', text: 'All Mockify API keys follow this format:' },
      {
        type: 'code',
        lang: 'text',
        label: 'Key format',
        code: `mk_live_xxxxxxxxxxxxxxxxxxxxxxxxxxxx
     ↑    ↑
     │    └─ 32-character random token
     └─ Environment prefix (live or test)`,
      },
      { type: 'h2', text: 'Rotating and revoking keys' },
      { type: 'p', text: 'To rotate a key, click the rotate icon next to it. A new key is generated instantly and the old one is immediately invalidated — update your application before rotating. To permanently disable a key, click Revoke. Revoked keys cannot be restored.' },
    ],
  },

  // ── Rate Limits ───────────────────────────────────────────────────────────
  'rate-limits': {
    id: 'rate-limits',
    sectionId: 'api-keys',
    title: 'Rate Limits & Expiry',
    description: 'Configure rate limits and expiration dates for your API keys.',
    prev: { id: 'generating-api-keys', sectionId: 'api-keys', title: 'Generating API Keys' },
    next: { id: 'permission-scopes', sectionId: 'api-keys', title: 'Permission Scopes' },
    content: [
      { type: 'p', text: 'Each API key can have its own rate limit and expiration date, giving you fine-grained control over how and for how long each key can be used.' },
      { type: 'h2', text: 'Rate limits' },
      { type: 'p', text: 'Rate limits are measured in requests per minute (RPM) per API key. When a key exceeds its limit, subsequent requests return HTTP 429 until the minute window resets.' },
      {
        type: 'table',
        headers: ['Plan', 'Default RPM', 'Max RPM per key'],
        rows: [
          ['Free', '10', '50'],
          ['Pro', '200', '2,000'],
          ['Enterprise', 'Custom', 'Custom'],
        ],
      },
      {
        type: 'callout',
        variant: 'tip',
        title: 'Set conservative limits on shared keys',
        text: 'If a key is used by multiple team members or CI environments, set a lower RPM to prevent accidental hammering of your mock endpoints.',
      },
      { type: 'h2', text: 'Expiry dates' },
      { type: 'p', text: 'You can set an expiry date on any API key. After that date, the key will return HTTP 401 on all requests. This is useful for temporary access, contractor keys, or short-lived CI tokens.' },
      { type: 'p', text: 'When a key is 7 days from expiry, you\'ll see a warning badge in the API Keys list. Mockify does not automatically send expiry email — check your keys periodically.' },
    ],
  },

  // ── Permission Scopes ─────────────────────────────────────────────────────
  'permission-scopes': {
    id: 'permission-scopes',
    sectionId: 'api-keys',
    title: 'Permission Scopes',
    description: 'Understand and configure the four levels of API key permission scopes.',
    prev: { id: 'rate-limits', sectionId: 'api-keys', title: 'Rate Limits & Expiry' },
    next: { id: 'key-security', sectionId: 'api-keys', title: 'Key Security' },
    content: [
      { type: 'p', text: 'Scopes define what an API key can access. The narrower the scope, the lower the risk if a key is ever compromised.' },
      { type: 'h2', text: 'The four scope levels' },
      {
        type: 'table',
        headers: ['Scope', 'Access', 'Use When'],
        rows: [
          ['Organization', 'All projects, schemas, and resources in the org', 'Internal tooling or CI that needs full access'],
          ['Project', 'All schemas in a specific project', 'A frontend app consuming one project\'s data'],
          ['Schema', 'A single schema within a project', 'Isolating access to one data type (e.g. only "products")'],
          ['Resource', 'Specific HTTP methods on a specific schema', 'Read-only external access (e.g. only GET on "users")'],
        ],
      },
      { type: 'h2', text: 'Choosing the right scope' },
      { type: 'p', text: 'For most frontend development use cases, project-level scope is the right choice. It gives your app access to all schemas in a project without exposing other projects.' },
      { type: 'p', text: 'Use schema-level or resource-level scope when your key is going into a less trusted environment — for example, a public demo, a third-party tool, or a shared CI pipeline.' },
      {
        type: 'callout',
        variant: 'info',
        title: 'Scope examples',
        text: '"org:xyz-corp" grants full access to all of xyz-corp. "project:xyz-corp/ecommerce-app" grants access to all schemas under ecommerce-app only.',
      },
      { type: 'h2', text: 'Resource scope and HTTP methods' },
      { type: 'p', text: 'At the resource level, you can specify exactly which HTTP methods the key can use. For example: read-only access (GET only), or write access (POST, PUT, PATCH, DELETE).' },
      {
        type: 'code',
        lang: 'json',
        label: 'Example resource scope',
        code: `{
  "scope": "resource",
  "orgSlug": "xyz-corp",
  "projectSlug": "ecommerce-app",
  "schemaSlug": "products",
  "methods": ["GET"]
}`,
      },
    ],
  },

  // ── Key Security ──────────────────────────────────────────────────────────
  'key-security': {
    id: 'key-security',
    sectionId: 'api-keys',
    title: 'Key Security Best Practices',
    description: 'How to keep your Mockify API keys secure.',
    prev: { id: 'permission-scopes', sectionId: 'api-keys', title: 'Permission Scopes' },
    next: { id: 'what-is-schema', sectionId: 'schemas', title: 'What Is a Schema?' },
    content: [
      { type: 'p', text: 'API keys grant access to your mock data and should be treated with the same care as passwords.' },
      { type: 'h2', text: 'Never commit keys to source control' },
      { type: 'p', text: 'Store API keys in environment variables, not in your source code. Use a .env file locally and your CI/CD secrets manager in production.' },
      {
        type: 'code',
        lang: 'bash',
        label: '.env.local',
        code: `# Do this
VITE_MOCKIFY_API_KEY=mk_live_your_key_here

# Never do this — do not hardcode in source files`,
      },
      {
        type: 'code',
        lang: 'javascript',
        label: 'Access in code',
        code: `// Vite exposes VITE_ prefixed env vars to the browser
const apiKey = import.meta.env.VITE_MOCKIFY_API_KEY;`,
      },
      {
        type: 'callout',
        variant: 'danger',
        title: 'Keys in client-side code are visible',
        text: 'Any API key included in browser-side JavaScript can be extracted by users. For public-facing apps, use resource-level read-only scopes and treat exposure as a known risk. For sensitive data, proxy requests through your own backend.',
      },
      { type: 'h2', text: 'Rotate keys on suspected compromise' },
      { type: 'p', text: 'If you believe a key has been exposed, rotate it immediately from the API Keys page. Rotation generates a new key and invalidates the old one instantly. Update your application\'s environment variable before rotating.' },
    ],
  },

  // ── What Is a Schema ──────────────────────────────────────────────────────
  'what-is-schema': {
    id: 'what-is-schema',
    sectionId: 'schemas',
    title: 'What Is a Schema?',
    description: 'Understand Mockify schemas and how they define your mock data.',
    prev: { id: 'key-security', sectionId: 'api-keys', title: 'Key Security' },
    next: { id: 'creating-schema', sectionId: 'schemas', title: 'Creating Your First Schema' },
    content: [
      { type: 'p', text: 'A schema is the blueprint for your mock data. It defines what a single record looks like — what fields it has and what type of data each field contains. Mockify uses your schema to generate realistic, consistent data.' },
      { type: 'p', text: 'Think of a schema the same way you\'d think of a TypeScript interface or a database table definition. If your API returns User objects, you create a User schema.' },
      { type: 'h2', text: 'How schemas map to endpoints' },
      { type: 'p', text: 'Each schema automatically gets a REST endpoint under your project\'s URL namespace. A schema named "users" becomes accessible at:' },
      {
        type: 'code',
        lang: 'text',
        label: 'Schema → Endpoint',
        code: `Schema name:   users
Endpoint:      GET https://mockify.dev/api/{orgSlug}/{projectSlug}
               GET https://mockify.dev/api/{orgSlug}/{projectSlug}:id`,
      },
      { type: 'h2', text: 'Schema vs. mock data' },
      {
        type: 'table',
        headers: ['Concept', 'Definition'],
        rows: [
          ['Schema', 'The shape definition — field names and types. Like a class or interface.'],
          ['Mock Data', 'The generated records based on the schema. Like instances of the class.'],
        ],
      },
    ],
  },

  // ── Creating Schema ───────────────────────────────────────────────────────
  'creating-schema': {
    id: 'creating-schema',
    sectionId: 'schemas',
    title: 'Creating Your First Schema',
    description: 'Step-by-step guide to creating a schema and generating mock data.',
    prev: { id: 'what-is-schema', sectionId: 'schemas', title: 'What Is a Schema?' },
    next: { id: 'field-types', sectionId: 'schemas', title: 'Field Types & Validation' },
    content: [
      { type: 'p', text: 'Creating a schema is the core workflow in Mockify. Here\'s how to go from zero to generated data.' },
      {
        type: 'steps',
        items: [
          { title: 'Open your project', text: 'Navigate to your organization and click the project you want to add a schema to.' },
          { title: 'Click "New Schema"', text: 'A schema builder will appear.' },
          { title: 'Name your schema', text: 'Use a lowercase, plural noun that describes the resource (e.g. "users", "products", "orders"). This becomes part of the endpoint URL.' },
          { title: 'Add fields', text: 'For each piece of data, click "Add Field". Set the field name and choose a type from the dropdown.' },
          { title: 'Save the schema', text: 'Click Save. Your schema is created but has no data yet.' },
        ],
      },
      { type: 'h2', text: 'Example: Product schema' },
      {
        type: 'code',
        lang: 'json',
        label: 'Product Schema Definition',
        code: `{
  "name": "Payment Transaction",
  "schemaJson": {
    "transactionId": "uuid",
    "amount": "number",
    "method": { "type": "enum", "values": ["CARD", "UPI", "NET_BANKING"] },
    "status": { "type": "enum", "values": ["SUCCESS", "FAILED", "PENDING"] },
    "timestamp": "datetime"
  }
}`,
      },
      {
        type: 'callout',
        variant: 'tip',
        title: 'Slug tip',
        text: 'The schema name is automatically slugified for the URL. "Payment Transaction" becomes /payment-transactions in your endpoint.',
      },
    ],
  },

  // ── Field Types ───────────────────────────────────────────────────────────
  'field-types': {
    id: 'field-types',
    sectionId: 'schemas',
    title: 'Field Types & Validation',
    description: 'All available field types and their configuration options.',
    prev: { id: 'creating-schema', sectionId: 'schemas', title: 'Creating Your First Schema' },
    next: { id: 'endpoint-structure', sectionId: 'mock-endpoints', title: 'Endpoint URL Structure' },
    content: [
      { type: 'p', text: 'Mockify supports a wide range of field types for generating realistic data. Each type produces contextually appropriate values.' },
      { type: 'h2', text: 'Identity & System' },
      {
        type: 'table',
        headers: ['Type', 'Example Output', 'Notes'],
        rows: [
          ['uuid', '550e8400-e29b-41d4-a716-446655440000', 'RFC 4122 v4 UUID'],
          ['autoIncrement', '1, 2, 3, ...', 'Sequential integer ID'],
          ['createdAt', '2024-03-12T08:45:00Z', 'ISO 8601 datetime'],
          ['updatedAt', '2024-03-15T14:22:00Z', 'Always ≥ createdAt'],
        ],
      },
      { type: 'h2', text: 'People' },
      {
        type: 'table',
        headers: ['Type', 'Example Output'],
        rows: [
          ['firstName', 'Emily'],
          ['lastName', 'Carter'],
          ['fullName', 'Emily Carter'],
          ['email', 'emily.carter@example.com'],
          ['phone', '+1-555-867-5309'],
          ['avatar', 'https://avatar.mockify.dev/...'],
        ],
      },
      { type: 'h2', text: 'Text & Content' },
      {
        type: 'table',
        headers: ['Type', 'Example Output', 'Options'],
        rows: [
          ['word', 'elephant', '—'],
          ['sentence', 'The quick brown fox...', 'wordCount: 5–20'],
          ['paragraph', 'Lorem ipsum...', 'sentenceCount: 3–7'],
          ['slug', 'my-cool-product', '—'],
          ['url', 'https://example.com/path', '—'],
        ],
      },
      { type: 'h2', text: 'Numbers & Booleans' },
      {
        type: 'table',
        headers: ['Type', 'Example Output', 'Options'],
        rows: [
          ['number', '42', 'min, max, precision'],
          ['float', '3.14', 'min, max, decimals'],
          ['boolean', 'true', 'weight (0–1 for true probability)'],
        ],
      },
      { type: 'h2', text: 'Enums & References' },
      {
        type: 'table',
        headers: ['Type', 'Example Output', 'Options'],
        rows: [
          ['enum', '"active"', 'values: array of strings'],
          ['oneOf', '"blue"', 'values: array of any JSON values'],
        ],
      },
      {
        type: 'callout',
        variant: 'info',
        title: 'More types coming',
        text: 'Mockify is actively expanding its type library. Upcoming types include address, coordinates, color, and credit card (safe test numbers only).',
      },
    ],
  },

  // ── Endpoint Structure ────────────────────────────────────────────────────
  'endpoint-structure': {
    id: 'endpoint-structure',
    sectionId: 'mock-endpoints',
    title: 'Endpoint URL Structure',
    description: 'How Mockify endpoint URLs are constructed.',
    prev: { id: 'field-types', sectionId: 'schemas', title: 'Field Types & Validation' },
    next: { id: 'http-methods', sectionId: 'mock-endpoints', title: 'Supported HTTP Methods' },
    content: [
      { type: 'p', text: 'Every schema in Mockify automatically gets a set of REST endpoints. The URL structure follows a consistent pattern based on your organization, project, and schema slugs.' },
      { type: 'h2', text: 'URL pattern' },
      {
        type: 'code',
        lang: 'text',
        label: 'Base URL structure',
        code: `https://mockify.dev/api/{orgSlug}/{projectSlug}/{schemaSlug}/records
https://mockify.dev/api/{orgSlug}/{projectSlug}/{schemaSlug}/records/{id}`,
      },
      { type: 'h2', text: 'Example URLs' },
      {
        type: 'table',
        headers: ['Operation', 'URL'],
        rows: [
          ['List all users', 'GET /api/xyz-corp/ecommerce-app/users/records'],
          ['Get user by ID', 'GET /api/xyz-corp/ecommerce-app/users/records/550e8400-...'],
          ['Create user', 'POST /api/xyz-corp/ecommerce-app/users/records'],
          ['Update user', 'PUT /api/xyz-corp/ecommerce-app/users/records/550e8400-...'],
          ['Delete user', 'DELETE /api/xyz-corp/ecommerce-app/users/records/550e8400-...'],
        ],
      },
      { type: 'h2', text: 'Pagination' },
      { type: 'p', text: 'List endpoints support pagination via query parameters:' },
      {
        type: 'code',
        lang: 'bash',
        label: 'Paginated request',
        code: `GET /api/xyz-corp/ecommerce-app/users/records?page=2&pageSize=10`,
      },
      {
        type: 'code',
        lang: 'json',
        label: 'Paginated response',
        code: `{
  "records": [...],
  "total": 50,
  "page": 2,
  "pageSize": 10,
  "totalPages": 5
}`,
      },
    ],
  },

  // ── HTTP Methods ──────────────────────────────────────────────────────────
  'http-methods': {
    id: 'http-methods',
    sectionId: 'mock-endpoints',
    title: 'Supported HTTP Methods',
    description: 'All HTTP methods available on Mockify mock endpoints.',
    prev: { id: 'endpoint-structure', sectionId: 'mock-endpoints', title: 'Endpoint URL Structure' },
    next: { id: 'using-api-key', sectionId: 'mock-endpoints', title: 'Authenticating Requests' },
    content: [
      { type: 'p', text: 'Mockify supports the full set of standard HTTP methods. All endpoints automatically handle each method — you don\'t need to configure anything.' },
      {
        type: 'table',
        headers: ['Method', 'Endpoint', 'Behavior'],
        rows: [
          ['GET', '{schema}/records', 'Returns a paginated list of records'],
          ['GET', '{schema}/records/:id', 'Returns a single record by ID'],
          ['POST', '{schema}/records', 'Creates a new record and returns it with a generated ID'],
          ['PUT', '{schema}/records/:id', 'Replaces a record entirely'],
          ['PATCH', '{schema}/records/:id', 'Partially updates a record'],
          ['DELETE', '{schema}/records/:id', 'Deletes a record and returns 204 No Content'],
        ],
      },
      {
        type: 'callout',
        variant: 'info',
        title: 'POST and PUT do not validate body shape',
        text: 'Mockify accepts any JSON body for write operations. It doesn\'t enforce that the body matches your schema — that\'s intentional, so you can test edge cases freely.',
      },
    ],
  },

  // ── Using API Key ─────────────────────────────────────────────────────────
  'using-api-key': {
    id: 'using-api-key',
    sectionId: 'mock-endpoints',
    title: 'Authenticating Requests',
    description: 'How to use your API key to authenticate requests to mock endpoints.',
    prev: { id: 'http-methods', sectionId: 'mock-endpoints', title: 'Supported HTTP Methods' },
    next: { id: 'error-simulation', sectionId: 'mock-endpoints', title: 'Error Simulation' },
    content: [
      { type: 'p', text: 'All Mockify endpoints require authentication. Pass your API key in the Authorization header as a Bearer token.' },
      { type: 'h2', text: 'Authorization header' },
      {
        type: 'code',
        lang: 'bash',
        label: 'cURL',
        code: `curl https://mockify.dev/api/{orgSlug}/{projectSlug}/users/records \\
  -H "Authorization: Bearer mk_live_your_api_key_here"`,
      },
      {
        type: 'code',
        lang: 'javascript',
        label: 'JavaScript (fetch)',
        code: `const res = await fetch('https://mockify.dev/api/{orgSlug}/{projectSlug}/users/records', {
  headers: {
    'Authorization': \`Bearer \${import.meta.env.VITE_MOCKIFY_API_KEY}\`,
    'Content-Type': 'application/json',
  },
});`,
      },
      {
        type: 'code',
        lang: 'javascript',
        label: 'Axios',
        code: `import axios from 'axios';

const mockify = axios.create({
  baseURL: 'https://mockify.dev/api/{orgSlug}/{projectSlug}',
  headers: {
    Authorization: \`Bearer \${import.meta.env.VITE_MOCKIFY_API_KEY}\`,
  },
});

const { data } = await mockify.get('/users/records');`,
      },
      { type: 'h2', text: 'Authentication errors' },
      {
        type: 'table',
        headers: ['Status', 'Reason'],
        rows: [
          ['401 Unauthorized', 'Missing or invalid API key'],
          ['401 Unauthorized', 'Key has expired'],
          ['403 Forbidden', 'Key exists but lacks scope for this resource'],
          ['429 Too Many Requests', 'Rate limit exceeded'],
        ],
      },
    ],
  },

  // ── Error Simulation ──────────────────────────────────────────────────────
  'error-simulation': {
    id: 'error-simulation',
    sectionId: 'mock-endpoints',
    title: 'Error Simulation',
    description: 'Force specific HTTP error responses to test your error handling.',
    prev: { id: 'using-api-key', sectionId: 'mock-endpoints', title: 'Authenticating Requests' },
    next: { id: 'common-errors', sectionId: 'troubleshooting', title: 'Common Errors' },
    content: [
      { type: 'p', text: 'When building frontends, you need to test how your app handles API errors. Mockify lets you force specific error responses using a special request header.' },
      { type: 'h2', text: 'Forcing an error response' },
      { type: 'p', text: 'Add the X-Mockify-Force-Status header to any request to receive that HTTP status code instead of the normal response.' },
      {
        type: 'code',
        lang: 'bash',
        label: 'Force a 500 error',
        code: `curl https://mockify.dev/api/{orgSlug}/{projectSlug}/products \\
  -H "Authorization: Bearer mk_live_..." \\
  -H "X-Mockify-Force-Status: 500"`,
      },
      {
        type: 'table',
        headers: ['Status Code', 'Use Case'],
        rows: [
          ['400', 'Test validation error UI'],
          ['401', 'Test expired session handling'],
          ['403', 'Test permission denied screens'],
          ['404', 'Test empty state / not found UI'],
          ['422', 'Test form validation feedback'],
          ['429', 'Test rate limit / retry logic'],
          ['500', 'Test server error fallback UI'],
          ['503', 'Test maintenance mode or offline states'],
        ],
      },
      {
        type: 'callout',
        variant: 'tip',
        title: 'This header is for development only',
        text: 'The X-Mockify-Force-Status header only works with development-environment API keys (mk_test_ prefix). It is silently ignored on production keys.',
      },
    ],
  },

  // ── Common Errors ─────────────────────────────────────────────────────────
  'common-errors': {
    id: 'common-errors',
    sectionId: 'troubleshooting',
    title: 'Common Errors',
    description: 'Solutions to the most frequently encountered errors in Mockify.',
    prev: { id: 'error-simulation', sectionId: 'mock-endpoints', title: 'Error Simulation' },
    next: { id: 'api-key-issues', sectionId: 'troubleshooting', title: 'API Key Issues' },
    content: [
      { type: 'p', text: 'This page covers the most common issues developers encounter and how to fix them.' },
      { type: 'h2', text: '401 Unauthorized' },
      { type: 'p', text: 'Symptom: All API requests return 401.' },
      { type: 'p', text: 'Causes and fixes: The Authorization header is missing — ensure you\'re sending it on every request. The key prefix is wrong — it must be "Bearer ", including the trailing space. The key has expired — check the expiry date in API Keys. The key has been revoked — you\'ll need to generate a new one.' },
      { type: 'h2', text: '403 Forbidden' },
      { type: 'p', text: 'Symptom: Requests return 403 on specific endpoints but not others.' },
      { type: 'p', text: 'Cause: Your API key\'s scope doesn\'t cover the resource you\'re accessing. Fix: Check the key\'s permission scope in the API Keys page. If you need broader access, create a new key with the appropriate scope.' },
      { type: 'h2', text: '404 Not Found' },
      { type: 'p', text: 'Symptom: Endpoints return 404.' },
      { type: 'p', text: 'Causes: The org slug, project slug, or schema slug in the URL is wrong — copy them exactly from the Mockify dashboard. The schema exists but has no data generated — go to your schema and click Generate Data. The record ID you\'re requesting doesn\'t exist.' },
      { type: 'h2', text: 'CORS errors in the browser' },
      { type: 'p', text: 'Symptom: Browser console shows a CORS policy error.' },
      { type: 'p', text: 'Fix: Mockify\'s API endpoints include CORS headers that allow any origin by default. If you\'re still seeing CORS errors, check that you\'re hitting api.mockify.dev (not the dashboard URL) and that the endpoint path is correct.' },
      {
        type: 'callout',
        variant: 'info',
        title: 'Still stuck?',
        text: 'Contact support at support@mockify.dev with your organization slug and the full request/response you\'re seeing.',
      },
    ],
  },

  // ── API Key Issues ────────────────────────────────────────────────────────
  'api-key-issues': {
    id: 'api-key-issues',
    sectionId: 'troubleshooting',
    title: 'API Key Issues',
    description: 'Diagnose and fix problems with API key creation, usage, and management.',
    prev: { id: 'common-errors', sectionId: 'troubleshooting', title: 'Common Errors' },
    next: { id: 'permission-errors', sectionId: 'troubleshooting', title: 'Permission Errors' },
    content: [
      { type: 'h2', text: '"I can\'t see my API key"' },
      { type: 'p', text: 'Symptom: The key was created but you didn\'t copy it.' },
      { type: 'p', text: 'Fix: API keys cannot be retrieved after creation. You must rotate the key to get a new one. Go to API Keys → click Rotate on the affected key → copy the new key immediately.' },
      { type: 'h2', text: '"My key stopped working"' },
      { type: 'p', text: 'Possible causes: The key was revoked by an Admin or Owner. The key expired (check the expiry date column). The key was rotated — old keys are immediately invalidated on rotation.' },
      { type: 'h2', text: '"I can\'t create an API key"' },
      { type: 'p', text: 'Only Owners and Admins can create API keys. If you\'re a Developer or Viewer, contact your organization Admin.' },
      { type: 'h2', text: '"Rate limit exceeded" unexpectedly' },
      { type: 'p', text: 'If you\'re hitting 429s and shouldn\'t be, check: Is this key shared across multiple services or team members? Are you running automated tests that fire many parallel requests? Increase the key\'s RPM limit or create a separate key for automated testing.' },
    ],
  },

  // ── Permission Errors ─────────────────────────────────────────────────────
  'permission-errors': {
    id: 'permission-errors',
    sectionId: 'troubleshooting',
    title: 'Permission Errors',
    description: 'Diagnose and resolve RBAC and scope-related permission issues.',
    prev: { id: 'api-key-issues', sectionId: 'troubleshooting', title: 'API Key Issues' },
    content: [
      { type: 'p', text: 'Permission errors fall into two categories: user role permissions (what you can do in the dashboard) and API key scope permissions (what your application can access).' },
      { type: 'h2', text: 'Dashboard permission errors' },
      { type: 'p', text: 'Symptom: A button or action is greyed out, or you see "You don\'t have permission to do this."' },
      { type: 'p', text: 'Fix: Check your role in the organization\'s Members tab. Compare it against the permissions matrix in Roles & Permissions. If you need elevated access, contact your organization Owner.' },
      { type: 'h2', text: 'API 403 errors' },
      { type: 'p', text: 'Symptom: Your API key returns 403 on specific endpoints.' },
      { type: 'p', text: 'Diagnosis: Look at the key\'s scope in the API Keys page. Compare it to the endpoint you\'re hitting. Common mismatches: A project-scoped key trying to access a different project. A schema-scoped key trying to access a different schema. A resource-scoped key using an HTTP method not in its allowed methods list.' },
      {
        type: 'callout',
        variant: 'tip',
        title: 'Narrowing down the issue',
        text: 'Try creating a temporary org-scoped key to test the same request. If it works, the issue is definitely your original key\'s scope configuration.',
      },
    ],
  },
};