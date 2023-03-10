import React from "react";
import { TabItem } from "./NewPostForm";

type TabItemModuleProps = {
  item: TabItem;
};

const TabItemModule: React.FC<TabItemModuleProps> = ({ item }) => {
  return <>{item.title}</>;
};
export default TabItemModule;
