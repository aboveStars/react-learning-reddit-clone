import useDirectory from "@/src/hooks/useDirectory";
import { ChevronDownIcon } from "@chakra-ui/icons";
import {
  Flex,
  Icon,
  Image,
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

const Directory: React.FC = () => {
  const { diretoryState, toggleMenuOpen } = useDirectory();
  return (
    <>
      <Menu isOpen={diretoryState.isOpen}>
        <MenuButton
          cursor="pointer"
          padding="0px 6px"
          borderRadius={4}
          _hover={{
            outline: "1px solid",
            outlineColor: "gray.200",
          }}
          mr={1}
          onClick={toggleMenuOpen}
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
                {diretoryState.selectedMenuItem.imageURL ? (
                  <>
                    <Image
                      src={diretoryState.selectedMenuItem.imageURL}
                      borderRadius="full"
                      boxSize="24px"
                      mr={2}
                    />
                  </>
                ) : (
                  <>
                    <Icon
                      as={diretoryState.selectedMenuItem.icon}
                      fontSize="20"
                      color={diretoryState.selectedMenuItem.iconColor}
                      mr={1}
                    />
                  </>
                )}

                <Flex
                  display={{
                    base: "none",
                    md: "flex",
                  }}
                >
                  <Text fontWeight={700}>
                    {diretoryState.selectedMenuItem.displayText}
                  </Text>
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
};
export default Directory;
