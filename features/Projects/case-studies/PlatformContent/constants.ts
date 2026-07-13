import { 
  Cpu, 
  Database, 
  Sliders, 
  Code, 
  Server, 
  Eye, 
  Settings, 
  CreditCard 
} from 'lucide-react';

export const INITIAL_COMPONENTS = [
  { id: 'comp_1', type: 'Navbar', label: 'Main Navigation Bar', config: { style: 'Default Dark', links: 3 } },
  { id: 'comp_2', type: 'FormCard', label: 'User Registration Form', config: { fields: ['Nama', 'Email', 'Role'] } }
];

export const INITIAL_DB_SCHEMAS = [
  { id: 'tbl_1', name: 'users_entity', rows: 42, fields: ['id', 'name', 'email'] },
  { id: 'tbl_2', name: 'orders_entity', rows: 128, fields: ['id', 'user_id', 'total_amount'] }
];

export const MODULE_DETAILS = [
  { 
    id: '01', 
    title: 'Screen Builder', 
    code: 'SYS-CANVAS',
    stack: 'ZUSTAND + REACT FLOW',
    icon: Cpu,
    status: 'STABLE',
    color: 'text-emerald-400',
    diagnosticMsg: 'STATE_ISO: Isolated Zustand store verified in 0.4ms',
    desc: 'Re-engineered the client-side drag-and-drop render pipeline to achieve a stable 60 FPS under high node stress. Isolated interactive component drag states from the global React virtual DOM tree, bypassed layout-blocking cascading re-renders using Zustand store selector optimization, and optimized the layout parsing algorithm to compile raw nested JSON component definitions into live UI layouts with sub-millisecond overhead.' 
  },
  { 
    id: '02', 
    title: 'Resource Manager', 
    code: 'DB-SCHEMA',
    stack: 'POSTGRES / SQL RELATOR',
    icon: Database,
    status: 'ONLINE',
    color: 'text-blue-400',
    diagnosticMsg: 'DB_SCHEMA: Relationship graphs validated successfully.',
    desc: 'Built the visual schema modeler enabling drag-and-drop database entity design and relationship mapping (1-to-N, N-to-N). Optimized performance by decoupling the SVG routing lines layout math from the state updates. Programmed a client-side validator to inspect index structures and table keys, preventing circular relations or invalid data-types before submitting migration schemas to Postgres/MySQL.' 
  },
  { 
    id: '03', 
    title: 'Workflow Automator', 
    code: 'BPMN-ENGINE',
    stack: 'BPMN-JS + TRANSPILES',
    icon: Sliders,
    status: 'ACTIVE',
    color: 'text-purple-400',
    diagnosticMsg: 'BPMN_FLOW: Test event triggered ON_INSERT_USER successfully.',
    desc: 'Integrated bpmn-js to allow builders to visual design complex automated logic sequences. Developed a parsing compiler that translates graphical diagram flows into structured database trigger sequences, SQL query filters, and scheduled cron jobs. Included a dynamic integrity validator that checks logic paths and alerts builders of disconnected flow points or infinite loop traps.' 
  },
  { 
    id: '04', 
    title: 'Navigation Manager', 
    code: 'NAV-ROUTING',
    stack: 'NEXT.JS ROUTER',
    icon: Code,
    status: 'ROUTING',
    color: 'text-amber-400',
    diagnosticMsg: 'NAV_MGR: Router schema map compiled successfully.',
    desc: 'Engineered dynamic menu routing panels which allow configuration of custom application path segments and navigation headers. Implemented tree-shaking routing updates, ensuring modifications to layout trees dynamically sync to Next.js routes and trigger smooth page transitions without forcing full-page reloads.' 
  },
  { 
    id: '05', 
    title: 'Deployment Pipeline', 
    code: 'DEP-CAPACITOR',
    stack: 'CAPACITOR + WEB BUILD',
    icon: Server,
    status: 'STANDBY',
    color: 'text-teal-400',
    diagnosticMsg: 'CAPACITOR: iOS/Android certificate bundle signatures valid.',
    desc: 'Programmed the build pipeline delegating workspace asset bundling to asynchronous background workers. Managed the compilation flow that wraps the web client package inside a Capacitor runtime environment for hybrid native iOS and Android packages, utilizing local caching strategies to reduce repetitive compilation tasks by up to 40%.' 
  },
  { 
    id: '06', 
    title: 'Preview Sandbox', 
    code: 'SND-VALIDATOR',
    stack: 'IFRAME RUNTIME',
    icon: Eye,
    status: 'READY',
    color: 'text-indigo-400',
    diagnosticMsg: 'SANDBOX: Active simulation container responded within 2ms.',
    desc: 'Created an isolated preview environment executing dynamic layout structures inside a secure sandboxed iframe container. Established a custom postMessage communication bridge to intercept and mock database requests, allowing builders to test database queries and forms safely without modifying production data.' 
  },
  { 
    id: '07', 
    title: 'System Settings', 
    code: 'SET-SECURITY',
    stack: 'MULTI-TENANT LOCK',
    icon: Settings,
    status: 'ENFORCED',
    color: 'text-rose-400',
    diagnosticMsg: 'SYS_SETTINGS: Environment constants loaded successfully.',
    desc: 'Structured system-level settings, environment variable bindings, and workspace-level permission configurations. Optimized metadata state parsing to verify client configuration settings instantly, enforcing strict role policies and multi-tenant security layers on the client-side UI before requests are routed.' 
  },
  { 
    id: '08', 
    title: 'Billing & Subscription', 
    code: 'BIL-STRIPE',
    stack: 'STRIPE & MIDTRANS',
    icon: CreditCard,
    status: 'SECURED',
    color: 'text-yellow-400',
    diagnosticMsg: 'STRIPE: Received charge.succeeded callback payload validation OK.',
    desc: 'Integrated Stripe and Midtrans gateways to support real-time transaction updates and seat subscription management. Developed a billing validation gatekeeper module to lock or unlock advanced editor capabilities based on team limit boundaries, enforcing enterprise license constraints gracefully.' 
  }
];
