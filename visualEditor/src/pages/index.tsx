import {
  Divider,
  Flex,
  Stack,
  Text,
  IconButton,
  Image,
  Textarea,
  FormControl,
  FormLabel,
  Box,
  Button,
  HStack,
  Link,
  FormHelperText,
  VStack,
} from '@chakra-ui/react';
import React, { useEffect } from 'react';
import { FaGithub } from 'react-icons/fa';
import * as parse from '@xstate/machine-extractor';
import lzstring from 'lz-string';

export const Index = () => {
  const [fileContent, setFileContent] =
    React.useState<string>(`import { createMachine } from 'xstate';

  export const machine = createMachine({
    id: 'machine',
    initial: 'idle',
    states: {
      idle: {
        on: {
          FETCH: 'loading',
        },
      },
      loading: {
        on: {
          RESOLVE: 'success',
          REJECT: 'failure',
        },
      },
      success: {
        type: 'final',
      },
      failure: {
        type: 'final',
      },
    },
  });`);
  const [error, setError] = React.useState<string>('');
  const [screenshotUrl, setScreenshotUrl] = React.useState<string>('');
  const [machineUrl, setMachineUrl] = React.useState<string>('');

  useEffect(() => {
    try {
      const parsed = parse.extractMachinesFromFile(fileContent);

      const machine = parsed?.machines.at(0);

      if (!machine) {
        return;
      }
      const compressed = lzstring.compressToEncodedURIComponent(
        JSON.stringify(machine?.toConfig()),
      );

      if (compressed.length === 0) {
        return;
      }

      const machineUrl = `https://xstate-screenshot.vercel.app/machine/${compressed}`;

      const params = new URLSearchParams({
        url: machineUrl,
        element: '#canvas > div:nth-child(1) > div:nth-child(2)',
      });
      const screenshotApiUrl = `https://browser-screenshots.vercel.app/api?${params}`;

      setError('');
      setMachineUrl(machineUrl);
      setScreenshotUrl(screenshotApiUrl);
    } catch (e) {
      if (e instanceof Error) {
        setError(e.message);
      }
    }
  }, [fileContent]);

  return (
    <Stack py="10" pb="20" px={['2', '5', '20']} overflow="auto" maxH="100vh">
      <div>
        <Flex align="center">
          <Text fontSize="2xl" fontWeight="medium">
            SS screenshots
          </Text>
          <IconButton
            size="lg"
            isRound
            ml="auto"
            aria-label="Open Github Repo"
            title="Open Github Repo"
            variant="ghost"
            icon={<FaGithub />}
            as={Link}
            href={'https://github.com/Rei-x/xstate-viz-screenshot-generator'}
            target="_blank"
          />
        </Flex>
        <Divider />
      </div>
      <Box maxW="container.md">
        <FormControl>
          <FormLabel>Paste machine file</FormLabel>
          <Textarea
            value={fileContent}
            onChange={(e) => setFileContent(e.target.value)}
            minH="lg"
            defaultValue={``}
            placeholder={``}
          />
          <FormHelperText>
            {error ? <Text color="red.500">{error}</Text> : null}
          </FormHelperText>
        </FormControl>
        <VStack my={2}>
          <Link href={screenshotUrl}>Screenshot url</Link>
          <Link href={machineUrl}>Machine URL (preview)</Link>
        </VStack>
        <Box>
          <Image
            src={screenshotUrl}
            alt="screenshot"
            fallbackSrc="https://miro.medium.com/v2/resize:fit:3840/1*oQXT3LKxRHELzgutvn1XZg.png"
          />
        </Box>
      </Box>
    </Stack>
  );
};

export default Index;
