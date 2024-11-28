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
  blue: 'bg-blue-50 text-blue-600',
  green: 'bg-green-50 text-green-600',
  purple: 'bg-purple-50 text-purple-600',
  orange: 'bg-orange-50 text-orange-600'
};

export default function DashboardPage() {
  const navigate = useNavigate();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-semibold text-gray-900 mb-8">Welcome to LegalFlow</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {sections.map((section) => {
          const Icon = section.icon;
          return (
            <button
              key={section.name}
              onClick={() => navigate(section.href)}
              className="flex items-start p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 text-left w-full group"
            >
              <div className={`p-3 rounded-lg mr-4 ${colorClasses[section.color as keyof typeof colorClasses]}`}>
                <Icon className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                  {section.name}
                </h3>
                <p className="mt-1 text-sm text-gray-500">{section.description}</p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}