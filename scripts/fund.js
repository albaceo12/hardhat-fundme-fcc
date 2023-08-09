const {getNamedAccounts, deployments} = require("hardhat")

async function main() {
    const {deployer} = await getNamedAccounts()
    const fundme = await ethers.getContract("FundMe", deployer)
    console.log("Deploying contract....")
    const tnx_res = await fundme.fund({
        value: ethers.parseEther("0.00054"),
    })
    await tnx_res.wait(1)
    console.log("funded!....")
}
main()
    .then(() => process.exit(0))
    .catch((err) => {
        console.log(err)
        process.exit(1)
    })
