import { Tab, TabList, TabPanel, Tabs } from "react-aria-components";

const tabStyle =
  "p-2 outline-none cursor-default text-mauve10 relative transition-colors duration-200 hovered:text-mauve12 focus:text-ruby9 selected:text-ruby9";

interface TabGroupProps {
  tabs: {
    id: string;
    label: string;
  }[];
  content: {
    id: string;
    node: React.ReactNode;
  }[];
  ariaLabel: string;
}

export function TabGroup({ tabs, content, ariaLabel }: TabGroupProps) {
  return (
    <Tabs className="flex orientation-horizontal:flex-col">
      <TabList
        aria-label={ariaLabel}
        className="flex orientation-horizontal:border-b-ruby9"
      >
        {tabs.map((tab) => (
          <Tab key={tab.id} id={tab.id} className={tabStyle}>
            {tab.label}
          </Tab>
        ))}
      </TabList>
      {content.map((content) => (
        <TabPanel key={content.id} id={content.id}>
          {content.node}
        </TabPanel>
      ))}
    </Tabs>
  );
}
