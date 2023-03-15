import { ChevronDownIcon } from "@chakra-ui/icons";
import {
  Flex,
  Icon,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Text,
} from "@chakra-ui/react";
import React from "react";
import { TiHome } from "react-icons/ti";
import Communities from "./Communities";

const Directory: React.FC = () => (
  <>
    <Menu isOpen={false}>
      <MenuButton
        cursor="pointer"
        padding="0px 6px"
        borderRadius={4}
        _hover={{
          outline: "1px solid",
          outlineColor: "gray.200",
        }}
        mr={1}
      >
        <Flex align="center">
          <Flex
            align="center"
            justify="space-between"
            width={{
              base: "auto",
              md: "200px",
            }}
          >
            <Flex align="center">
              <Icon as={TiHome} fontSize="20" mr={1} />
              <Flex
                display={{
                  base: "none",
                  md: "flex",
                }}
              >
                <Text fontWeight={700}>Home</Text>
              </Flex>
            </Flex>

            <ChevronDownIcon ml={1} />
          </Flex>
        </Flex>
      </MenuButton>
      <MenuList>
        <Communities />
      </MenuList>
    </Menu>
  </>
);
export default Directory;
