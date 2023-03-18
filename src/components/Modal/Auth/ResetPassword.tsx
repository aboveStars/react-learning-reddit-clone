import { auth } from "@/src/firebase/clientApp";
import { Button, Flex, Input, Text } from "@chakra-ui/react";
import React, { useState } from "react";
import { useSendPasswordResetEmail } from "react-firebase-hooks/auth";

const ResetPassword: React.FC = () => {
  const [email, setEmail] = useState("");
  const [success, setSuccess] = useState(false);

  const [sendPasswordResetEmail, sending, error] =
    useSendPasswordResetEmail(auth);

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    await sendPasswordResetEmail(email);

    setSuccess(true);
  };

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };

  return (
    <>
      <Flex>
        <form onSubmit={onSubmit}>
          <Text
            textAlign="center"
            fontSize="15pt"
            fontFamily="heading"
            fontStyle="italic"
          >
            Reset Your Password
          </Text>
          <Input
            onChange={onChange}
            placeholder="Type your email..."
            type="email"
            _placeholder={{
              color: "gray.500",
            }}
            bg="gray.50"
            required
          ></Input>
          {success ? (
            <Text color="green" textAlign="center" mt={3} fontSize="12pt">
              Resetting email was sent, check Your Email
            </Text>
          ) : (
            <Button width="100%" mt={5} type="submit" isLoading={sending}>
              Reset Your Password
            </Button>
          )}
        </form>
      </Flex>
    </>
  );
};
export default ResetPassword;
