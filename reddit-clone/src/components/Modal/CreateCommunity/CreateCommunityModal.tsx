import {
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Box,
  Divider,
  Text,
  Input,
  Stack,
  Checkbox,
  Flex,
  Icon,
} from "@chakra-ui/react";
import React, { useState } from "react";

import { HiLockClosed } from "react-icons/hi";
import { BsFillEyeFill, BsFillPersonFill } from "react-icons/bs";
import {
  doc,
  getDoc,
  runTransaction,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import { auth, firestore } from "@/src/firebase/clientApp";
import { useAuthState } from "react-firebase-hooks/auth";

type CreateCommunityModalProps = {
  open: boolean;
  handleClose: () => void;
};

const CreateCommunityModal: React.FC<CreateCommunityModalProps> = ({
  open,
  handleClose,
}) => {
  const [communityName, setCommunityName] = useState("");
  const [charsRemaining, setCharsRemaining] = useState(21);
  const [communityType, setCommunityType] = useState("public");
  const [error, setError] = useState("");
  const [user] = useAuthState(auth);
  const [loading, setLoading] = useState(false);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.value.length > 21) return;

    setCommunityName(event.target.value);
    setCharsRemaining(21 - event.target.value.length);
  };

  const onCommunityTypeChanged = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setCommunityType(event.target.name);
  };

  const handleCreateCommunity = async () => {
    // Validation community name
    setError("");
    const format = /[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
    if (format.test(communityName)) {
      setError("Community Name can only letters, numbers, and underscores");
      return;
    } else if (communityName.length < 3) {
      setError("Community Name length should be more than 3 characters");
      return;
    }

    setLoading(true);

    try {
      const communityDocRef = doc(firestore, "communities", communityName);

      // We use "runTransactions" beacuse we want all of them work together
      // If one of them fails, all of them will fail.
      await runTransaction(firestore, async (transaction) => {
        // check if community exists
        const communityDoc = await transaction.get(communityDocRef);
        if (communityDoc.exists()) {
          throw new Error(
            `Sorry, r/${communityName} is taken. Try another please`
          );
        }
        // create community
        transaction.set(communityDocRef, {
          creatorId: user?.uid,
          createdAt: serverTimestamp(),
          numberOfMembers: 1,
          privacyType: communityType,
        });

        // create communitySnippet for user
        // We didn't create seperate varibale to hold "doc" we just passed it.
        transaction.set(
          doc(firestore, `users/${user?.uid}/communitySnippets`, communityName),
          {
            communityId: communityName,
            isModerator: true,
          }
        );
      });
    } catch (error: any) {
      console.log(`handleCreateCommunity Error:  ${error} `);
      setError(error.message);
    }

    setLoading(false);
  };

  return (
    <>
      <Modal isOpen={open} onClose={handleClose} size="lg">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            display="flex"
            flexDirection="column"
            fontSize="15"
            padding="3"
          >
            Create Community
          </ModalHeader>

          <Box pl={3} pr={3}>
            <Divider />
            <ModalCloseButton />
            <ModalBody display="flex" flexDirection="column" padding="10px 0px">
              <Text fontSize={11} color="gray.500">
                Community names including capitalization cannot be changed
              </Text>
              <Text position="relative" top="28px" left="10px" color="gray.500">
                r/
              </Text>
              <Input
                value={communityName}
                size="sm"
                pl="22px"
                onChange={handleChange}
              />
              <Text
                color={charsRemaining === 0 ? "red" : "gray.500"}
                fontSize="9pt"
              >
                {charsRemaining} Characters remaining
              </Text>
              <Text fontSize="9pt" pt={1} color="red">
                {error}
              </Text>
              <Box mt="4" mb="4">
                <Text fontWeight={600} fontSize={15}>
                  Community Type
                </Text>
                <Stack mt={2}>
                  <Checkbox
                    name="public"
                    isChecked={communityType === "public"}
                    onChange={onCommunityTypeChanged}
                  >
                    <Flex align="center">
                      <Icon as={BsFillPersonFill} color="gray.500" mr={1} />
                      <Text mr={2} color="gray.500" fontSize="10pt">
                        Public
                      </Text>
                      <Text fontSize="8pt" color="gray.500">
                        Anyone can view posts, comment to this community
                      </Text>
                    </Flex>
                  </Checkbox>
                  <Checkbox
                    name="restricted"
                    isChecked={communityType === "restricted"}
                    onChange={onCommunityTypeChanged}
                  >
                    <Flex align="center">
                      <Icon as={BsFillEyeFill} color="gray.500" mr={1} />
                      <Text mr={2} color="gray.500" fontSize="10pt">
                        Restricted
                      </Text>
                      <Text fontSize="8pt" color="gray.500">
                        Anyone can view this community, but only approved users
                        can post
                      </Text>
                    </Flex>
                  </Checkbox>
                  <Checkbox
                    name="private"
                    isChecked={communityType === "private"}
                    onChange={onCommunityTypeChanged}
                  >
                    <Flex align="center">
                      <Icon as={HiLockClosed} color="gray.500" mr={1} />
                      <Text mr={2} color="gray.500" fontSize="10pt">
                        Public
                      </Text>
                      <Text fontSize="8pt" color="gray.500">
                        Only approved users can view and submit this community
                      </Text>
                    </Flex>
                  </Checkbox>
                </Stack>
              </Box>
            </ModalBody>
          </Box>

          <ModalFooter bg="gray.100" borderRadius="0 0 10px 10px">
            <Button
              variant="outline"
              mr={3}
              onClick={handleClose}
              height="30px"
            >
              Close
            </Button>
            <Button
              height="30px"
              onClick={handleCreateCommunity}
              isLoading={loading}
            >
              Create Community
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
export default CreateCommunityModal;
