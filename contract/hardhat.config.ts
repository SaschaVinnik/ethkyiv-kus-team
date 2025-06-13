import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "dotenv/config"; 

const config: HardhatUserConfig = {
  solidity: "0.8.19",
  networks: {
    sepolia: {
      url: `https://sepolia.infura.io/v3/${process.env.INFURA_API_KEY}`,
      accounts: [
        process.env.PARTY1_PRIVATE_KEY!,
        process.env.PARTY2_PRIVATE_KEY!,
        process.env.MEDIATOR_PRIVATE_KEY!
      ],
    }
  }
};

export default config;