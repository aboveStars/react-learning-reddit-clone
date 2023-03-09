import { Flex } from "@chakra-ui/react";
import React, { ReactNode } from "react";

type PageContentProps = {
  children: ReactNode;
};

const PageContent: React.FC<PageContentProps> = ({ children }) => {
  console.log(children);
  return (
    <>
      {/** Outer Top Flex */}
      <Flex justify="center" p="16px" border="1px solid red">
        {/** Main Content Flex  */}
        <Flex
          width="95%"
          justify="center"
          maxWidth="860px"
          border="1px solid green"
        >
          {/** Left Content */}
          <Flex
            direction="column"
            width={{
              base: "100%",
              md: "65%",
            }}
            mr={{
              base: 0,
              md: 6,
            }}
            border="1px solid blue"
          >
            {children && children[0 as keyof typeof children]}
          </Flex>
          {/** Right Content */}
          <Flex
            display={{
              base: "none",
              md: "flex",
            }}
            flexGrow={1}
            border="1px solid orange"
          >
            {children && children[1 as keyof typeof children]}
          </Flex>
        </Flex>
      </Flex>
    </>
  );
};
export default PageContent;
