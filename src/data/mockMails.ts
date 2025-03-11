export const mockMails = [
  {
    id: '1',
    from: {
      name: 'John Lennon',
      email: 'john@example.com'
    },
    to: {
      name: 'Paul McCartney',
      email: 'paul@example.com'
    },
    subject: 'UI project: Client Dashboard',
    preview: 'Hey Paul, I've finished the initial designs for the client dashboard...',
    content: `<p>Hey Paul,</p>
    <p>I've finished the initial designs for the client dashboard. The main features include:</p>
    <ul>
      <li>Overview of key metrics</li>
      <li>Project timeline visualization</li>
      <li>Resource allocation charts</li>
    </ul>
    <p>Let me know what you think!</p>
    <p>Best regards,<br>John</p>`,
    date: new Date('2024-01-20T09:16:00'),
    folder: 'inbox',
    isRead: false,
    isStarred: true,
  },
  {
    id: '2',
    from: {
      name: 'Sarah Johnson',
      email: 'sarah@example.com'
    },
    to: {
      name: 'Paul McCartney',
      email: 'paul@example.com'
    },
    subject: 'Legal Document Review Required',
    preview: 'Please review the attached legal documents for the upcoming merger...',
    content: `<p>Hi Paul,</p>
    <p>I need your expert review on the attached legal documents for our upcoming merger. Key points to consider:</p>
    <ul>
      <li>Liability clauses in section 3.2</li>
      <li>Intellectual property rights</li>
      <li>Employee transition terms</li>
    </ul>
    <p>Please provide your feedback by EOD Friday.</p>
    <p>Best regards,<br>Sarah</p>`,
    date: new Date('2024-01-19T14:23:00'),
    folder: 'inbox',
    isRead: true,
    isStarred: false,
  },
  {
    id: '3',
    from: {
      name: 'Michael Chen',
      email: 'michael@example.com'
    },
    to: {
      name: 'Paul McCartney',
      email: 'paul@example.com'
    },
    subject: 'Contract Updates - Urgent Review Needed',
    preview: 'I've made some important updates to the contract based on client feedback...',
    content: `<p>Dear Paul,</p>
    <p>I've updated the contract based on the client's feedback. Major changes include:</p>
    <ul>
      <li>Revised payment terms</li>
      <li>Updated delivery schedule</li>
      <li>Modified scope of work</li>
    </ul>
    <p>Please review these changes as soon as possible.</p>
    <p>Thanks,<br>Michael</p>`,
    date: new Date('2024-01-18T11:05:00'),
    folder: 'inbox',
    isRead: true,
    isStarred: true,
  }
];