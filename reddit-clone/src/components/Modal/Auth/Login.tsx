import { authModalState } from "@/src/atoms/authModalAtom";
import { auth } from "@/src/firebase/clientApp";
import { FIREBASE_ERRORS } from "@/src/firebase/errors";
import { Button, Flex, Input, Text } from "@chakra-ui/react";
import React, { useState } from "react";
import { useSignInWithEmailAndPassword } from "react-firebase-hooks/auth";
import { useSetRecoilState } from "recoil";

type LoginProps = {};

const Login: React.FC<LoginProps> = () => {
  const setAuthModalState = useSetRecoilState(authModalState);
  const [loginForm, setLoginForm] = useState({
    email: "",
    password: "",
  });

  const [signInWithEmailAndPassword, user, loading, error] =
    useSignInWithEmailAndPassword(auth);

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    signInWithEmailAndPassword(loginForm.email, loginForm.password);
  };
  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLoginForm((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  };

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
        <Button
          width="100%"
          height="36px"
          mt={2}
          mb={2}
          type="submit"
          isLoading={loading}
        >
          Log In
        </Button>
        {error && (
          <Text color="red" textAlign="center" fontSize="10pt">
            {FIREBASE_ERRORS[error.message as keyof typeof FIREBASE_ERRORS]}
          </Text>
        )}
        <Flex fontSize="9pt" justify="center">
          <Text mr={1}>New Here?</Text>
          <Text
            color="blue.500"
            fontWeight={700}
            cursor="pointer"
            onClick={() =>
              setAuthModalState((prev) => ({ ...prev, view: "signup" }))
            }
          >
            Sign Up
          </Text>
        </Flex>
        <Flex fontSize="9pt" justify="center">
          <Text mr={1}>Forgot Password?</Text>
          <Text
            color="blue.500"
            fontWeight={700}
            cursor="pointer"
            onClick={() =>
              setAuthModalState((prev) => ({ ...prev, view: "resetPassword" }))
            }
          >
            Reset
          </Text>
        </Flex>
      </form>
    </>
  );
};
export default Login;
