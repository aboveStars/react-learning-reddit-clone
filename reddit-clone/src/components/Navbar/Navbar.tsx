import { auth } from "@/src/firebase/clientApp";
import { Flex, Image } from "@chakra-ui/react";
import React from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import RightContent from "./RightContent/RightContent";
import SearchInput from "./SearchInput";

const Navbar: React.FC = () => {
  const [user, loading, error] = useAuthState(auth);
  return (
    <>
      <Flex align="center" bg="white" height="44px" padding="6px 12px">
        <Image src="/images/redditFace.svg" height="30px" />
        <Image
          src="/images/redditText.svg"
          height="46px"
          display={{ base: "none", md: "unset" }}
        />
        <SearchInput />
        <RightContent user={user} />
      </Flex>

      {/* <Directory/>
      <SearchInput/>
      <WriteContent/> */}
    </>
  );
};
export default Navbar;
