
import { ReactNode } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export interface TabItem {
  id: string;
  label: string;
  content: ReactNode;
  isLoading?: boolean;
}

interface TabManagerProps {
  tabs: TabItem[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
  className?: string;
}

export function TabManager({
  tabs,
  activeTab,
  onTabChange,
  className
}: TabManagerProps) {
  return (
    <Tabs
      defaultValue={activeTab}
      onValueChange={onTabChange}
      className={className}
    >
      <TabsList>
        {tabs.map((tab) => (
          <TabsTrigger key={tab.id} value={tab.id}>
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>
      
      {tabs.map((tab) => (
        <TabsContent 
          key={tab.id} 
          value={tab.id}
          isLoading={tab.isLoading}
        >
          {tab.content}
        </TabsContent>
      ))}
    </Tabs>
  );
}
