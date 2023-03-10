import { ChevronDownIcon } from "@chakra-ui/icons";
import {
  Menu,
  MenuButton,
  Button,
  MenuList,
  MenuItem,
  Icon,
  Flex,
  MenuDivider,
  Text,
} from "@chakra-ui/react";
import { signOut, User } from "firebase/auth";
import React from "react";
import { FaRedditSquare } from "react-icons/fa";
import { IoMdStar } from "react-icons/io";
import { VscAccount } from "react-icons/vsc";
import { CgProfile } from "react-icons/cg";
import { MdOutlineLogin } from "react-icons/md";
import { auth } from "@/src/firebase/clientApp";
import { useResetRecoilState, useSetRecoilState } from "recoil";
import { authModalState } from "@/src/atoms/authModalAtom";
import { communityState } from "@/src/atoms/communitiesAtom";
type UserMenuProps = {
  user?: User | null;
};

const UserMenu: React.FC<UserMenuProps> = ({ user }) => {
  const setAuthModalState = useSetRecoilState(authModalState);
  const resetCommunityState = useResetRecoilState(communityState);

  const logout = async () => {
    await signOut(auth);
    //clear community state
    resetCommunityState();
  };

  return (
    <>
      <Menu>
        <MenuButton
          cursor="pointer"
          padding="0px 6px"
          borderRadius={4}
          _hover={{
            outline: "1px solid",
            outlineColor: "gray.200",
          }}
        >
          {user ? (
            <Flex align="center">
              <Flex align="center">
                <>
                  <Icon
                    as={FaRedditSquare}
                    fontSize={25}
                    color="gray.300"
                    mr={0.5}
                  />
                  <Flex
                    direction="column"
                    mr={2}
                    display={{
                      base: "none",
                      md: "flex",
                    }}
                  >
                    <Text fontSize="8pt" fontWeight={700}>
                      {user?.displayName || user.email?.split("@")[0]}
                    </Text>
                    <Flex align="center">
                      <Icon as={IoMdStar} fontSize={10} />
                      <Text fontSize="8pt" color="gray.500">
                        1 Karma
                      </Text>
                    </Flex>
                  </Flex>
                </>

                <ChevronDownIcon />
              </Flex>
            </Flex>
          ) : (
            <>
              <Flex align="center">
                <Icon as={VscAccount} fontSize={24} color="gray.400" />
                <ChevronDownIcon />
              </Flex>
            </>
          )}
        </MenuButton>
        <MenuList>
          {user ? (
            <>
              <MenuItem
                fontSize="10pt"
                fontWeight={700}
                _hover={{
                  bg: "blue.500",
                  textColor: "white",
                }}
              >
                <Flex align="center">
                  <Icon as={CgProfile} fontSize={20} mr={2} />
                  Profile
                </Flex>
              </MenuItem>
              <MenuDivider />
              <MenuItem
                fontSize="10pt"
                fontWeight={700}
                _hover={{
                  bg: "blue.500",
                  textColor: "white",
                }}
                onClick={logout}
              >
                <Flex align="center">
                  <Icon as={MdOutlineLogin} fontSize={20} mr={2} />
                  Log Out
                </Flex>
              </MenuItem>
            </>
          ) : (
            <>
              <MenuItem
                fontSize="10pt"
                fontWeight={700}
                _hover={{
                  bg: "blue.500",
                  textColor: "white",
                }}
                onClick={() => {
                  setAuthModalState({ open: true, view: "login" });
                }}
              >
                <Flex align="center">
                  <Icon as={MdOutlineLogin} fontSize={20} mr={2} />
                  Log In / Sign Up
                </Flex>
              </MenuItem>
            </>
          )}
        </MenuList>
      </Menu>
    </>
  );
};
export default UserMenu;
