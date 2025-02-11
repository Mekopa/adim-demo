import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Briefcase, Users, MessageSquare } from 'lucide-react';

const sections = [
  {
    name: 'Workflows',
    description: 'Create and manage legal document workflows',
    icon: FileText,
    href: '/workflows',
    color: 'blue'
  },
  {
    name: 'Document Vault',
    description: 'Securely store and organize your documents',
    icon: Briefcase,
    href: '/vault',
    color: 'green'
  },
  {
    name: 'Customers',
    description: 'Manage your client relationships',
    icon: Users,
    href: '/customers',
    color: 'purple'
  },
  {
    name: 'AI Assistant',
    description: 'Get instant answers from your documents',
    icon: MessageSquare,
    href: '/assistant',
    color: 'orange'
  }
];

const colorClasses = {
  blue: 'bg-blue-50 text-blue-600 group-hover:bg-blue-100',
  green: 'bg-green-50 text-green-600 group-hover:bg-green-100',
  purple: 'bg-purple-50 text-purple-600 group-hover:bg-purple-100',
  orange: 'bg-orange-50 text-orange-600 group-hover:bg-orange-100'
};

export default function DashboardPage() {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen min-w-screen">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-white mb-2">Welcome to A.D.I.M</h1>
        <p className="text-gray-400 mb-12">Your legal document management solution</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {sections.map((section) => {
            const Icon = section.icon;
            return (
              <button
                key={section.name}
                onClick={() => navigate(section.href)}
                className="group flex items-start p-6 bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50 hover:bg-gray-800/80 hover:border-gray-600/50 transition-all duration-200 text-left w-full"
              >
                <div className={`p-3 rounded-lg mr-4 transition-colors ${colorClasses[section.color as keyof typeof colorClasses]}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white group-hover:text-blue-400 transition-colors">
                    {section.name}
                  </h3>
                  <p className="mt-1 text-sm text-gray-400">{section.description}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}