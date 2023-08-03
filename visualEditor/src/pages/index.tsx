import { Divider, Flex, Stack, Text, IconButton } from '@chakra-ui/react';
import React from 'react';
import { FaGithub } from 'react-icons/fa';

export const Index = () => {
  return (
    <Stack py="10" px="20" overflow="auto" maxH="100vh">
      <div>
        <Flex align="center">
          <Text fontSize="2xl" fontWeight="medium">
            SS screenshots
          </Text>
          <IconButton
            size="sm"
            isRound
            ml="auto"
            aria-label="Open Github Repo"
            title="Open Github Repo"
            variant="ghost"
            icon={<FaGithub />}
            onClick={() =>
              window.open(
                'https://github.com/Rei-x/xstate-viz-screenshot-generator',
                '_blank',
              )
            }
          />
        </Flex>
        <Divider />
      </div>
    </Stack>
  );
};

export default Index;
