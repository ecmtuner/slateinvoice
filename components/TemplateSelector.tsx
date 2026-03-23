'use client';

interface Template {
  id: string;
  label: string;
  description: string;
  preview: React.ReactNode;
}

const templates: Template[] = [
  {
    id: 'classic',
    label: 'Classic',
    description: 'Professional blue header',
    preview: (
      <div className="rounded overflow-hidden border border-gray-200 h-20">
        <div className="bg-blue-600 h-5 w-full" />
        <div className="bg-white h-15 p-2 space-y-1">
          <div className="bg-gray-200 rounded h-1.5 w-3/4" />
          <div className="bg-gray-100 rounded h-1.5 w-1/2" />
          <div className="bg-gray-100 rounded h-1.5 w-2/3" />
        </div>
      </div>
    ),
  },
  {
    id: 'modern',
    label: 'Modern',
    description: 'Dark navy header',
    preview: (
      <div className="rounded overflow-hidden border border-gray-200 h-20">
        <div style={{ backgroundColor: '#1e293b' }} className="h-5 w-full" />
        <div className="bg-white h-15 p-2 space-y-1">
          <div className="bg-gray-200 rounded h-1.5 w-3/4" />
          <div className="bg-gray-100 rounded h-1.5 w-1/2" />
          <div className="bg-gray-100 rounded h-1.5 w-2/3" />
        </div>
      </div>
    ),
  },
  {
    id: 'minimal',
    label: 'Minimal',
    description: 'Clean black typography',
    preview: (
      <div className="rounded overflow-hidden border border-gray-200 h-20 bg-white p-2 space-y-1.5">
        <div className="bg-gray-900 rounded h-2 w-1/3" />
        <div className="bg-gray-300 rounded h-px w-full" />
        <div className="bg-gray-200 rounded h-1.5 w-3/4" />
        <div className="bg-gray-100 rounded h-1.5 w-1/2" />
      </div>
    ),
  },
];

interface TemplateSelectorProps {
  value: string;
  onChange: (template: string) => void;
}

export default function TemplateSelector({ value, onChange }: TemplateSelectorProps) {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
      <h3 className="text-sm font-semibold text-gray-400 uppercase mb-4">Invoice Template</h3>
      <div className="grid grid-cols-3 gap-4">
        {templates.map(t => (
          <button
            key={t.id}
            type="button"
            onClick={() => onChange(t.id)}
            className={`rounded-xl p-3 border-2 transition-all text-left ${
              value === t.id
                ? 'border-blue-500 bg-blue-950/30'
                : 'border-gray-700 bg-gray-800 hover:border-gray-600'
            }`}
          >
            {t.preview}
            <div className="mt-2">
              <p className={`text-sm font-semibold ${value === t.id ? 'text-blue-400' : 'text-white'}`}>
                {t.label}
              </p>
              <p className="text-xs text-gray-500 mt-0.5">{t.description}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
