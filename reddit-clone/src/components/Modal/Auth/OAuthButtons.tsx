import { auth } from "@/src/firebase/clientApp";
import { Button, Flex, Image, Text } from "@chakra-ui/react";
import React from "react";

import { useSignInWithGoogle } from "react-firebase-hooks/auth";

const OAuthButtons: React.FC = () => {
  const [signInWithGoogle, user, loading, error] = useSignInWithGoogle(auth);

  return (
    <>
      <Flex direction="column" width="100%" mb={3}>
        <Button
          variant="oauth"
          mb={2}
          isLoading={loading}
          onClick={() => {
            signInWithGoogle();
          }}
        >
          <Image src="images/googlelogo.png" height="20px" mr={2} />
          Continue With Google
        </Button>
        <Button variant="oauth" mb={2}>
          Other Provider
        </Button>
        {error && (
          <Text color="red" textAlign="center" fontSize="10pt">
            {error.message}
          </Text>
        )}
      </Flex>
    </>
  );
};
export default OAuthButtons;
