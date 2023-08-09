const {getNamedAccounts, ethers, network} = require("hardhat")
const {developmentchains} = require("../../hepler-hardhat-config.js")
const {assert, expect} = require("chai")
developmentchains.includes(network.name)
    ? describe.skip
    : describe("fundme", () => {
          let fundme, deployer
          const sendvalue = ethers.parseEther("0.00054")
          beforeEach(async () => {
              deployer = (await getNamedAccounts()).deployer
              fundme = await ethers.getContract("FundMe", deployer)
          })
          it("allows people to fund and withdraw", async () => {
              await fundme.fund({value: sendvalue})
              await fundme.withdraw()
              const endingbalance = await ethers.provider.getBalance(
                  fundme.target,
              )
              assert.equal(endingbalance.toString(), "0")
          })
      })
