import { create } from 'zustand';
import { Mail, mails } from '../data/mailData';

interface MailStore {
  mails: Mail[];
  selectedMail: Mail | null;
  selectedFolder: string;
  setSelectedMail: (id: string) => void;
  setSelectedFolder: (folder: string) => void;
  markAsRead: (id: string) => void;
  toggleStar: (id: string) => void;
  getFilteredMails: () => Mail[];
  getFolderCount: (folderId: string) => number;
}

export const useMailStore = create<MailStore>((set, get) => ({
  mails,
  selectedMail: null,
  selectedFolder: 'inbox',
  
  setSelectedMail: (id) => {
    const mail = get().mails.find(m => m.id === id);
    if (mail && !mail.isRead) {
      get().markAsRead(id);
    }
    set({ selectedMail: mail || null });
  },
  
  setSelectedFolder: (folder) => set({ selectedFolder: folder }),
  
  markAsRead: (id) =>
    set(state => ({
      mails: state.mails.map(mail =>
        mail.id === id ? { ...mail, isRead: true } : mail
      )
    })),
    
  toggleStar: (id) =>
    set(state => ({
      mails: state.mails.map(mail =>
        mail.id === id ? { ...mail, isStarred: !mail.isStarred } : mail
      )
    })),
    
  getFilteredMails: () => {
    const state = get();
    if (state.selectedFolder === 'starred') {
      return state.mails.filter(mail => mail.isStarred);
    }
    return state.mails.filter(mail => mail.folder === state.selectedFolder);
  },
  
  getFolderCount: (folderId: string) => {
    const state = get();
    if (folderId === 'starred') {
      return state.mails.filter(mail => mail.isStarred).length;
    }
    return state.mails.filter(mail => mail.folder === folderId).length;
  }
}));