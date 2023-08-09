const networkconfig = {
    5: {
        name: "goerli",
        ethUsdPriceFeed: "0x44390589104C9164407A0E0562a9DBe6C24A0E05",
    },
    11155111: {
        name: "Sepolia",
        ethUsdPriceFeed: "0x694AA1769357215DE4FAC081bf1f309aDC325306",
    },
    //31337
}
const developmentchains = ["hardhat", "localhost"]
const DECIMALS = 8
const INITIAL_ANSWER = 200_000_000_000
module.exports = {
    networkconfig,
    developmentchains,
    DECIMALS,
    INITIAL_ANSWER,
}
