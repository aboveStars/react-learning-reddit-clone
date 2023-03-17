import { defaultMenuItem } from "@/src/atoms/dirrectoryMenuAtom";
import { auth } from "@/src/firebase/clientApp";
import useDirectory from "@/src/hooks/useDirectory";
import { Flex, Image } from "@chakra-ui/react";
import React from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import Directory from "./Directory/Directory";
import RightContent from "./RightContent/RightContent";
import SearchInput from "./SearchInput";

const Navbar: React.FC = () => {
  const [user, loading, error] = useAuthState(auth);
  const { onSelectMenuItem } = useDirectory();
  return (
    <>
      <Flex
        align="center"
        bg="white"
        height="44px"
        padding="6px 12px"
        justify="space-between"
      >
        <Flex
          align="center"
          mr={{
            base: 1,
            md: 5,
          }}
          onClick={() => onSelectMenuItem(defaultMenuItem)}
        >
          <Image src="/images/redditFace.svg" height="30px" />
          <Image
            src="/images/redditText.svg"
            height="46px"
            display={{ base: "none", md: "unset" }}
          />
        </Flex>

        {user && <Directory />}

        <SearchInput user={user} />
        <RightContent user={user} />
      </Flex>

      {/* <Directory/>
      <SearchInput/>
      <WriteContent/> */}
    </>
  );
};
export default Navbar;
