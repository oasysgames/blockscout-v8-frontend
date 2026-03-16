import {
  Box,
  Input,
  Grid,
  Text,
  VStack,
  HStack,
  Spinner,
  Image,
  SimpleGrid,
  Flex,
} from "@chakra-ui/react";
import { useColorModeValue } from "toolkit/chakra/color-mode";
import { useExperiment } from "../experiment/useExperiment";

import ChartWidget from "ui/shared/chart/ChartWidget";

const CHART_COLORS = [
  "#FF6B6B", // red
  "#4FD1C5", // teal
  "#63B3ED", // blue
  "#9F7AEA", // purple
  "#F6E05E", // yellow
  "#68D391", // green
  "#FC8181", // pink
  "#4299E1", // lightblue
  "#B794F4", // violet
  "#F6AD55", // orange
];

const getChainLogoPath = (chainName: string) => {
  const baseName = chainName.toLowerCase().replace("verse", "");
  return `/images/chains/${baseName}.png`;
};

// Component PieChart
const PieChart = ({
  totalAccumulatedByChain,
  bgColor,
  textColor,
}: {
  totalAccumulatedByChain: { chainName: string; accumulated_amount: number }[];
  bgColor: string;
  textColor: string;
}) => {
  const total = totalAccumulatedByChain.reduce(
    (sum, chain) => sum + chain.accumulated_amount,
    0
  );

  return (
    <Box
      p={5}
      bg={bgColor}
      borderRadius="lg"
      boxShadow="sm"
      display="flex"
      flexDirection="column"
      alignItems="center"
    >
      <Box position="relative" width="250px" height="250px">
        <Box
          width="100%"
          height="100%"
          borderRadius="50%"
          background={`conic-gradient(${totalAccumulatedByChain
            .sort((a, b) => b.accumulated_amount - a.accumulated_amount)
            .map((chain, index, arr) => {
              const startPercent = arr
                .slice(0, index)
                .reduce(
                  (sum, c) =>
                    sum + (c.accumulated_amount / total) * 100,
                  0
                );
              const endPercent =
                startPercent +
                (chain.accumulated_amount / total) * 100;
              return `${CHART_COLORS[index % CHART_COLORS.length]} ${startPercent}% ${endPercent}%`;
            })
            .join(", ")})`}
        />
        <VStack
          position="absolute"
          top="50%"
          left="50%"
          transform="translate(-50%, -50%)"
          gap={1}
          align="center"
        >
          <Text fontSize="sm" color={textColor}>
            Total Deposit
          </Text>
          <Text fontSize="lg" fontWeight="bold" color="blue.500">
            {(total / 1000).toLocaleString(undefined, {
              maximumFractionDigits: 2,
            })}
            k OAS
          </Text>
        </VStack>
      </Box>

      {/* Legend */}
      <VStack mt={4} gap={2} align="stretch" width="100%">
        {totalAccumulatedByChain
          .sort((a, b) => b.accumulated_amount - a.accumulated_amount)
          .map((chain, index) => {
            const percentage = (
              (chain.accumulated_amount / total) *
              100
            ).toFixed(1);
            return (
              <HStack key={chain.chainName} gap={2} align="center">
                <Box
                  w="12px"
                  h="12px"
                  borderRadius="sm"
                  bg={CHART_COLORS[index % CHART_COLORS.length]}
                />
                <Box w="20px" h="20px" position="relative">
                  <Image
                    src={getChainLogoPath(chain.chainName)}
                    alt={`${chain.chainName} logo`}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "contain",
                    }}
                  />
                </Box>
                <Text fontSize="sm" color={textColor}>
                  {chain.chainName}
                </Text>
                <Text fontSize="sm" color="gray.500" ml="auto">
                  {percentage}%
                </Text>
              </HStack>
            );
          })}
      </VStack>
    </Box>
  );
};

// Component
const Experiment = () => {
  const {
    isLoading,
    error,
    startDate,
    endDate,
    chainFilter,
    uniqueChains,
    handleStartDateChange,
    handleEndDateChange,
    handleChainFilterChange,
    totalAccumulatedByChain,
    chainChartData,
  } = useExperiment();

  const bgColor = useColorModeValue("white", "gray.800");
  const textColor = useColorModeValue("gray.800", "white");

  const totalDeposit = totalAccumulatedByChain.reduce(
    (sum, chain) => sum + chain.accumulated_amount,
    0
  );

  return (
    <>
      {/* Filter Section */}
      <Box mb={6}>
        <Flex gap={4}>
          <Input
            type="date"
            value={startDate}
            onChange={(e) => handleStartDateChange(e.target.value)}
          />
          <Input
            type="date"
            value={endDate}
            onChange={(e) => handleEndDateChange(e.target.value)}
          />
          <select
            value={chainFilter}
            onChange={(e) => handleChainFilterChange(e.target.value)}
            style={{
              padding: "8px",
              borderRadius: "4px",
              border: "1px solid #ccc",
              fontSize: "16px",
            }}
          >
            <option value="" disabled>
              Select a chain
            </option>
            {uniqueChains.map((chain) => (
              <option key={chain} value={chain}>
                {chain}
              </option>
            ))}
          </select>
        </Flex>
      </Box>

      <Box mb={6}>
        <Flex gap={4} align="baseline" wrap="wrap">
          <Text fontSize="2xl" fontWeight="bold" color={textColor}>
            Total Deposit
          </Text>
          <Text fontSize="xl" fontWeight="semibold" color="blue.500">
            {(totalDeposit / 1000).toLocaleString(undefined, {
              maximumFractionDigits: 2,
            })}
            k OAS
          </Text>
        </Flex>
      </Box>

      {/* Loading State */}
      {isLoading && (
        <Box textAlign="center" my={4}>
          <Spinner />
        </Box>
      )}

      {/* Error Message */}
      {error && (
        <Box bg="red.100" p={4} borderRadius="md" mb={4}>
          <Text color="red.600">{error.message}</Text>
        </Box>
      )}

      {/* Pie Chart */}
      <Grid
        templateColumns={{ base: "1fr", md: "300px 1fr" }}
        gap={6}
        mb={8}
      >
        <PieChart
          totalAccumulatedByChain={totalAccumulatedByChain}
          bgColor={bgColor}
          textColor={textColor}
        />

        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} gap={6}>
          {totalAccumulatedByChain.map((stat) => (
            <Box
              key={stat.chainName}
              p={5}
              bg={bgColor}
              borderRadius="lg"
              boxShadow="sm"
            >
              <HStack gap={2} mb={2} align="center">
                <Box w="32px" h="32px" position="relative">
                  <Image
                    src={getChainLogoPath(stat.chainName)}
                    alt={`${stat.chainName} logo`}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "contain",
                    }}
                  />
                </Box>
                <Text fontSize="lg" fontWeight="bold" color={textColor}>
                  {stat.chainName}
                </Text>
              </HStack>
              <Text fontSize="2xl" fontWeight="bold" color="blue.500">
                {(stat.accumulated_amount / 1000).toLocaleString(
                  undefined,
                  { maximumFractionDigits: 2 }
                )}
                k OAS
              </Text>
              <Text fontSize="sm" color="gray.500">
                Last Update:{" "}
                {new Date(
                  Number(stat.latestBlockTime) * 1000
                ).toLocaleString()}
              </Text>
            </Box>
          ))}
        </SimpleGrid>
      </Grid>

      {chainChartData.map((chain) => (
        <Box key={chain.chainName} mb={6}>
          <ChartWidget
            title={`${chain.chainName} Total Deposit History`}
            description="Daily total deposit"
            items={chain.data.map((item) => ({
              date: new Date(item.date),
              value: Number(item.value),
            }))}
            isLoading={isLoading}
            isError={!!error}
            units="OAS"
            valueFormatter={(val: number) =>
              `${(val / 1000).toLocaleString(undefined, {
                maximumFractionDigits: 2,
              })}k`
            }
          />
        </Box>
      ))}
    </>
  );
};

export default Experiment;
