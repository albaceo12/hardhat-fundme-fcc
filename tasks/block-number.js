const {task} = require("hardhat/config")
task("block-number", "Prints the current block number").setAction(
    async (taskArgs, hre) => {
        const blocknumbr = await hre.ethers.provider.getBlockNumber()
        console.log(`current block number: ${blocknumbr}`)
    },
)
