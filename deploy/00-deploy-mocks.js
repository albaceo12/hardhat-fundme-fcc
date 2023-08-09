const {network} = require("hardhat")
const {
    developmentchains,
    DECIMALS,
    INITIAL_ANSWER,
} = require("../hepler-hardhat-config.js")

module.exports = async ({getNamedAccounts, deployments}) => {
    const {log, deploy} = deployments
    const {deployer} = await getNamedAccounts()
    // const chainId = network.config.chainId
    if (developmentchains.includes(network.name)) {
        log("local network detected! deploying mocks...")
        await deploy("MockV3Aggregator", {
            contract: "MockV3Aggregator",
            from: deployer,
            log: true,
            args: [DECIMALS, INITIAL_ANSWER],
        })
        log("mocks deplyed!")
        log("-------------------------------------")
    }
}
module.exports.tags = ["all", "mocks"]
