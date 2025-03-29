import React from 'react';

interface DetailCardProps {
  title: string;
  sections: {
    title: string;
    items: {
      label: string;
      value: React.ReactNode;
    }[];
  }[];
  actions?: React.ReactNode;
  className?: string;
}

const DetailCard: React.FC<DetailCardProps> = ({
  title,
  sections,
  actions,
  className = ''
}) => {
  return (
    <div className={`bg-white rounded-lg border border-gray-200 overflow-hidden ${className}`}>
      <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
        <h3 className="text-lg font-medium text-gray-900">{title}</h3>
      </div>
      
      <div className="divide-y divide-gray-200">
        {sections.map((section, sectionIndex) => (
          <div key={sectionIndex} className="px-4 py-4">
            <h4 className="text-sm font-medium text-gray-700 mb-3">{section.title}</h4>
            <dl className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {section.items.map((item, itemIndex) => (
                <div key={itemIndex} className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500">{item.label}</dt>
                  <dd className="mt-1 text-sm text-gray-900">{item.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        ))}
      </div>
      
      {actions && (
        <div className="px-4 py-3 bg-gray-50 border-t border-gray-200 flex justify-end space-x-3">
          {actions}
        </div>
      )}
    </div>
  );
};

export default DetailCard;
