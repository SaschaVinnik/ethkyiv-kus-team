import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const DisputeResolutionModule = buildModule("DisputeResolutionModule", (m) => {
  const tokenAddress = "0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238";

  const dispute = m.contract("DisputeResolutionV2", [tokenAddress]);

  return { dispute };
});

export default DisputeResolutionModule;
