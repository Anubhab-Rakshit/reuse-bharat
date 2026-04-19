const hre = require("hardhat");
const fs = require("fs");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying contracts with account:", deployer.address);

  const CampusMarketplace = await hre.ethers.getContractFactory("CampusMarketplace");
  const marketplace = await CampusMarketplace.deploy();
  const marketplaceTx = await marketplace.deploymentTransaction();
  await marketplace.waitForDeployment();
  const marketplaceAddress = await marketplace.getAddress();
  console.log("CampusMarketplace deployed to:", marketplaceAddress);
  console.log("TX:", marketplaceTx.hash);

  const config = {
    network: hre.network.name,
    deployer: deployer.address,
    contract: {
      CampusMarketplace: marketplaceAddress,
    },
    transaction: marketplaceTx.hash,
  };

  fs.writeFileSync("deployment.json", JSON.stringify(config, null, 2));
  console.log("Deployment config saved to deployment.json");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });