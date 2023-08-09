const {network} = require("hardhat")
require("dotenv").config

// async function funcdeploy() {
//     console.log("DDDD")
// }
// funcdeploy()
//     .then(() => {
//         console.log("DDDD")
//         process.exit(0)
//     })
//     .catch(() => {
//         console.log("shit")
//         process.exit(1)
//     })
const {
    networkconfig,
    developmentchains,
} = require("../hepler-hardhat-config.js")
const {verify} = require("../utils/verify.js")
// const helperconfig=require("../helper-hardhat-config-js")
// const networkconfig=helperconfig.networkconfig

module.exports = async ({getNamedAccounts, deployments}) => {
    const {deploy, log} = deployments
    const {deployer} = await getNamedAccounts()
    const chainId = network.config.chainId
    // =
    let ethUsdPriceFeedAddress
    if (developmentchains.includes(network.name)) {
        const ethUsdAggregator = await deployments.get("MockV3Aggregator")
        ethUsdPriceFeedAddress = ethUsdAggregator.address
    } else {
        ethUsdPriceFeedAddress = networkconfig[chainId]["ethUsdPriceFeed"]
    }
    const args = [ethUsdPriceFeedAddress]
    const fundme = await deploy("FundMe", {
        from: deployer,
        args: args,
        log: true,
        waitConfirmations: network.config.blockConfirmations || 1,
    })
    if (
        !developmentchains.includes(network.name) &&
        process.env.ETHERSCAN_API_KEY
    ) {
        await verify(fundme.address, args)
    }
    log("-------------------------------------")
    /* how to interact with deployed contract in hardhat-deploy
        // const ddd = (await deployments.get("FundMe")).address
        // const de = await ethers.getContract("FundMe", ddd)
        // log(de)
    */
}
module.exports.tags = ["all", "mocks", "fundme"]
