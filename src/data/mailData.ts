export interface Mail {
  id: string;
  from: {
    name: string;
    email: string;
  };
  to: {
    name: string;
    email: string;
  };
  subject: string;
  preview: string;
  content: string;
  date: string;
  folder: string;
  isRead: boolean;
  isStarred: boolean;
}

export interface Folder {
  id: string;
  label: string;
  icon: string;
  count: number;
}

export const folders: Folder[] = [
  { id: 'inbox', label: 'Inbox', icon: 'Mail', count: 3 },
  { id: 'sent', label: 'Sent', icon: 'Send', count: 45 },
  { id: 'starred', label: 'Starred', icon: 'Star', count: 12 },
  { id: 'archive', label: 'Archive', icon: 'Archive', count: 89 },
  { id: 'trash', label: 'Trash', icon: 'Trash2', count: 23 },
  { id: 'drafts', label: 'Drafts', icon: 'File', count: 5 }
];

export const mails: Mail[] = [
  {
    id: "1",
    from: {
      name: "John Lennon",
      email: "john@example.com"
    },
    to: {
      name: "Paul McCartney",
      email: "paul@example.com"
    },
    subject: "UI project: Client Dashboard",
    preview: "Hey Paul, I've finished the initial designs for the client dashboard...",
    content: "Hey Paul,\n\nI've finished the initial designs for the client dashboard. The main features include:\n\n- Overview of key metrics\n- Project timeline visualization\n- Resource allocation charts\n\nLet me know what you think!\n\nBest regards,\nJohn",
    date: "2024-01-20T09:16:00",
    folder: "inbox",
    isRead: false,
    isStarred: true
  },
  {
    id: "2",
    from: {
      name: "Sarah Johnson",
      email: "sarah@example.com"
    },
    to: {
      name: "Paul McCartney",
      email: "paul@example.com"
    },
    subject: "Legal Document Review Required",
    preview: "Please review the attached legal documents for the upcoming merger...",
    content: "Hi Paul,\n\nI need your expert review on the attached legal documents for our upcoming merger. Key points to consider:\n\n- Liability clauses in section 3.2\n- Intellectual property rights\n- Employee transition terms\n\nPlease provide your feedback by EOD Friday.\n\nBest regards,\nSarah",
    date: "2024-01-19T14:23:00",
    folder: "inbox",
    isRead: true,
    isStarred: false
  },
  {
    id: "3",
    from: {
      name: "Michael Chen",
      email: "michael@example.com"
    },
    to: {
      name: "Paul McCartney",
      email: "paul@example.com"
    },
    subject: "Contract Updates - Urgent Review Needed",
    preview: "I've made some important updates to the contract based on client feedback...",
    content: "Dear Paul,\n\nI've updated the contract based on the client's feedback. Major changes include:\n\n- Revised payment terms\n- Updated delivery schedule\n- Modified scope of work\n\nPlease review these changes as soon as possible.\n\nThanks,\nMichael",
    date: "2024-01-18T11:05:00",
    folder: "inbox",
    isRead: true,
    isStarred: true
  }
];