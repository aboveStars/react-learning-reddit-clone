import { auth, firestore } from "@/src/firebase/clientApp";
import { Button, Flex, Image, Text } from "@chakra-ui/react";
import { User } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import React, { useEffect } from "react";

import { useSignInWithGoogle } from "react-firebase-hooks/auth";

const OAuthButtons: React.FC = () => {
  const [signInWithGoogle, userCred, loading, error] =
    useSignInWithGoogle(auth);

  const createUserDocument = async (user: User) => {
    const userDocRef = doc(firestore, "users", user.uid);
    await setDoc(userDocRef, JSON.parse(JSON.stringify(user)));
  };

  useEffect(() => {
    if (userCred) {
      createUserDocument(userCred.user);
    }
  }, [userCred]);

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
