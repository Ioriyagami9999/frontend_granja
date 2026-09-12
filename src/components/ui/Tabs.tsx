import { useState, type ComponentType, type ReactNode } from 'react';

export interface TabItem {
  id: string;
  label: string;
  icon?: ComponentType<{ size?: number; strokeWidth?: number }>;
  content: ReactNode;
}

export function Tabs({ tabs, defaultTabId }: { tabs: TabItem[]; defaultTabId?: string }) {
  const [activeId, setActiveId] = useState(defaultTabId ?? tabs[0]?.id);
  const active = tabs.find((tab) => tab.id === activeId) ?? tabs[0];

  return (
    <div>
      <div className="flex gap-1 border-b border-slate-200" role="tablist">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = tab.id === active?.id;
          return (
            <button
              key={tab.id}
              role="tab"
              aria-selected={isActive}
              onClick={() => setActiveId(tab.id)}
              className={`-mb-px flex items-center gap-1.5 border-b-2 px-3 py-2 text-sm font-medium transition-colors ${
                isActive
                  ? 'border-brand-600 text-brand-700'
                  : 'border-transparent text-slate-500 hover:text-slate-700'
              }`}
            >
              {Icon && <Icon size={14} strokeWidth={2.25} />}
              {tab.label}
            </button>
          );
        })}
      </div>
      <div className="pt-4">{active?.content}</div>
    </div>
  );
}
