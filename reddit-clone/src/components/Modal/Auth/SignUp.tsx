import { authModalState } from "@/src/atoms/authModalAtom";
import { auth, firestore } from "@/src/firebase/clientApp";
import { Button, Flex, Input, Text } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { useSetRecoilState } from "recoil";
import { useCreateUserWithEmailAndPassword } from "react-firebase-hooks/auth";
import { FIREBASE_ERRORS } from "@/src/firebase/errors";
import { User } from "firebase/auth";
import { addDoc, collection, doc, setDoc } from "firebase/firestore";

const SignUp: React.FC = () => {
  const [signUpForm, setSignUpForm] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });

  const setAuthModalState = useSetRecoilState(authModalState);

  const [createUserWithEmailAndPassword, userCred, loading, userError] =
    useCreateUserWithEmailAndPassword(auth);

  const [error, setError] = useState("");

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    if (signUpForm.password !== signUpForm.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    createUserWithEmailAndPassword(signUpForm.email, signUpForm.password);
  };
  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSignUpForm((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  };

  const createUserDocument = async (user: User) => {
    await setDoc(
      doc(firestore, `users`, user?.uid),
      JSON.parse(JSON.stringify(user))
    );
  };

  useEffect(() => {
    if (userCred) {
      createUserDocument(userCred.user);
    }
  }, [userCred]);

  return (
    <>
      <form onSubmit={onSubmit}>
        <Input
          required
          name="email"
          placeholder="E-Mail"
          type="email"
          mb={2}
          onChange={onChange}
          fontSize="10pt"
          _placeholder={{
            color: "gray.500",
          }}
          _hover={{
            border: "1px solid",
            borderColor: "blue.500",
          }}
          bg="gray.50"
        />
        <Input
          required
          name="password"
          placeholder="Password"
          type="password"
          mb={1}
          onChange={onChange}
          fontSize="10pt"
          _placeholder={{
            color: "gray.500",
          }}
          _hover={{
            border: "1px solid",
            borderColor: "blue.500",
          }}
          bg="gray.50"
        />
        <Input
          required
          name="confirmPassword"
          placeholder="Confirm Password"
          type="password"
          mb={1}
          onChange={onChange}
          fontSize="10pt"
          _placeholder={{
            color: "gray.500",
          }}
          _hover={{
            border: "1px solid",
            borderColor: "blue.500",
          }}
          bg="gray.50"
        />

        <Text textAlign="center" color="red" fontSize="10pt">
          {error ||
            FIREBASE_ERRORS[userError?.message as keyof typeof FIREBASE_ERRORS]}
        </Text>

        <Button
          width="100%"
          height="36px"
          mt={2}
          mb={2}
          type="submit"
          isLoading={loading}
        >
          Sign Up
        </Button>
        <Flex fontSize="9pt" justify="center">
          <Text mr={1}>All ready a redditor?</Text>
          <Text
            color="blue.500"
            fontWeight={700}
            cursor="pointer"
            onClick={() =>
              setAuthModalState((prev) => ({ ...prev, view: "login" }))
            }
          >
            Log In
          </Text>
        </Flex>
      </form>
    </>
  );
};
export default SignUp;
