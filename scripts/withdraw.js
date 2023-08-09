const {getNamedAccounts, deployments} = require("hardhat")

async function main() {
    const {deployer} = await getNamedAccounts()
    const fundme = await ethers.getContract("FundMe", deployer)
    console.log("Deploying contract....")
    const tnx_res = await fundme.withdraw()
    await tnx_res.wait(1)
    console.log("got it back!....")
}
main()
    .then(() => process.exit(0))
    .catch((err) => {
        console.log(err)
        process.exit(1)
    })
