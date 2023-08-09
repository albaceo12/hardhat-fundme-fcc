/** @type import('hardhat/config').HardhatUserConfig */
require("@nomicfoundation/hardhat-toolbox")
require("dotenv").config()
require("@nomicfoundation/hardhat-verify")
require("./tasks/block-number.js")
require("hardhat-gas-reporter")
require("@nomiclabs/hardhat-ethers")
require("hardhat-deploy")
// require("solidity-coverage")
// require("hardhat-deploy-ethers")
// require("@nomicfoundation/hardhat-ethers")
// require("@nomicfoundation/hardhat-chai-matchers")
// require("@typechain/hardhat")

task("accounts", "Prints the list of accounts", async () => {
    const accounts = await ethers.getSigners()

    for (const account of accounts) {
        console.log(account.address)
    }
})
const GOERLI_RPC_URL = process.env.GOERLI_RPC_URL
const GOERLI_PRIVATE_KEY = process.env.GOERLI_PRIVATE_KEY
const GOERLI_PRIVATE_KEY2 = process.env.GOERLI_PRIVATE_KEY2
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY
const COINMARKETCAP_API_KEY = process.env.COINMARKETCAP_API_KEY
module.exports = {
    defaultNetwork: "hardhat",
    networks: {
        goerli: {
            url: GOERLI_RPC_URL,
            accounts: [GOERLI_PRIVATE_KEY, GOERLI_PRIVATE_KEY2],
            chainId: 5,
            blockConfirmations: 6,
        },
        localhost: {
            url: "http://127.0.0.1:8545/",
            chainId: 31337,
        },
    },
    // solidity: "0.8.18",
    solidity: {
        compilers: [{version: "0.8.18"}, {version: "0.6.6"}],
    },
    etherscan: {apiKey: ETHERSCAN_API_KEY},
    // this added because of network error or header times error we came across in this course
    customChains: [
        {
            network: "goerli",
            chainId: 5,
            urls: {
                apiURL: "http://api-goerli.etherscan.io/api",
                browserURL: "https://goerli.etherscan.io",
            },
        },
    ],
    gasReporter: {
        enabled: true,
        outputFile: "gas-report.txt",
        noColors: true,
        currency: "usd",
        // coinmarketcap: COINMARKETCAP_API_KEY,
        token: "MATIC",
    },
    namedAccounts: {
        deployer: {
            default: 0, // here this will by default take the first account as deployer
            1: 0, // similarly on mainnet it will take the first account as deployer. Note though that depending on how hardhat network are configured, the account 0 on one network can be different than on another
        },
    },
}
