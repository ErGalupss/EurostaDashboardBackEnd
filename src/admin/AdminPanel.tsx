import React, { useState } from 'react';
import { 
  DndContext, 
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { SortableItem } from './SortableItem';
import * as Tabs from '@radix-ui/react-tabs';
import * as Switch from '@radix-ui/react-switch';

export const AdminPanel: React.FC = () => {
  const [blocks, setBlocks] = useState([
    { id: '1', type: 'Header', label: 'Main Header' },
    { id: '2', type: 'Chart', label: 'Sales Analytics' },
    { id: '3', type: 'Table', label: 'Recent Orders' },
  ]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      setBlocks((items) => {
        const oldIndex = items.findIndex(i => i.id === active.id);
        const newIndex = items.findIndex(i => i.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-900">
      {/* Sidebar Editor */}
      <aside className="w-64 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-4">
        <h2 className="text-lg font-bold mb-4">UI Editor</h2>
        <Tabs.Root defaultValue="sidebar">
          <Tabs.List className="flex gap-2 mb-4 border-b border-slate-100">
            <Tabs.Trigger value="sidebar" className="px-3 py-2 text-sm data-[state=active]:border-b-2 data-[state=active]:border-indigo-500">Menu</Tabs.Trigger>
            <Tabs.Trigger value="layout" className="px-3 py-2 text-sm data-[state=active]:border-b-2 data-[state=active]:border-indigo-500">Layout</Tabs.Trigger>
          </Tabs.List>
          
          <Tabs.Content value="sidebar" className="space-y-4">
            <button className="w-full py-2 bg-indigo-600 text-white rounded-md text-sm font-medium">Add Menu Item</button>
            {/* List of menu items with visibility toggles */}
            <div className="space-y-2">
              {['Dashboard', 'Users', 'Settings'].map(item => (
                <div key={item} className="flex items-center justify-between p-2 bg-slate-50 rounded border border-slate-100">
                  <span className="text-sm">{item}</span>
                  <Switch.Root className="w-8 h-4 bg-slate-300 rounded-full data-[state=checked]:bg-indigo-500">
                    <Switch.Thumb className="block w-3 h-3 bg-white rounded-full transition-transform translate-x-0.5 data-[state=checked]:translate-x-4.5" />
                  </Switch.Root>
                </div>
              ))}
            </div>
          </Tabs.Content>
          
          <Tabs.Content value="layout">
            <p className="text-xs text-slate-500 mb-4">Drag to reorder page blocks</p>
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
              <SortableContext items={blocks} strategy={verticalListSortingStrategy}>
                <div className="space-y-2">
                  {blocks.map(block => <SortableItem key={block.id} id={block.id} label={block.label} type={block.type} />)}
                </div>
              </SortableContext>
            </DndContext>
          </Tabs.Content>
        </Tabs.Root>
      </aside>

      {/* Preview Area */}
      <main className="flex-1 p-8 overflow-auto">
        <div className="max-w-4xl mx-auto bg-white dark:bg-slate-800 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-700 min-h-[600px] p-8">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-2xl font-bold">Live Preview</h1>
            <div className="flex gap-2">
              <button className="px-4 py-2 border border-slate-200 rounded-md text-sm">Save Draft</button>
              <button className="px-4 py-2 bg-indigo-600 text-white rounded-md text-sm">Publish to Prod</button>
            </div>
          </div>
          
          <div className="space-y-6">
            {blocks.map(block => (
              <div key={block.id} className="p-12 border-2 border-dashed border-slate-200 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400">
                {block.type}: {block.label}
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};
