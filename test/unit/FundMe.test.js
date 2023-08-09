const {assert, expect} = require("chai")
const {getNamedAccounts, deployments, ethers, network} = require("hardhat")
const {developmentchains} = require("../../hepler-hardhat-config.js")
!developmentchains.includes(network.name)
    ? describe.skip
    : describe("fundme", function () {
          let fundme, deployer, mockV3Aggregator
          const sendvalue = ethers.parseEther("0.026")
          beforeEach(async () => {
              // const accounts = await ethers.getSigners()
              // const accountZero = accounts[0]
              deployer = (await getNamedAccounts()).deployer
              await deployments.fixture(["all"])
              fundme = await ethers.getContract("FundMe", deployer)
              mockV3Aggregator = await ethers.getContract(
                  "MockV3Aggregator",
                  deployer,
              )
          })
          describe("constructor", () => {
              it("sets the aggregator address correctly", async () => {
                  const response = await fundme.priceFeed()
                  assert.equal(response, await mockV3Aggregator.getAddress())
              })
          })
          describe("fund", () => {
              it("fails if you dont send enough eth", async () => {
                  // await fundme.fund()
                  // expect(fundme.fund()).to.be.reverted
                  await expect(fundme.fund()).to.be.revertedWith(
                      "You need to spend more ETH!",
                  )
              })
              it("updated the amount funded data structure", async () => {
                  await fundme.fund({
                      value: sendvalue,
                  })
                  const response = await fundme.addressToAmountFunded(deployer)
                  assert.equal(response.toString(), sendvalue.toString())
              })
              it("add funder to array of funders", async () => {
                  await fundme.fund({
                      value: sendvalue,
                  })
                  const funder = await fundme.funders(0)
                  assert.equal(funder, deployer)
              })
          })
          describe("withdraw", () => {
              beforeEach(async () => {
                  await fundme.fund({
                      value: sendvalue,
                  })
              })
              it("withdraw ETH from a single funder", async () => {
                  //Arrange
                  const startfundmebalance = await ethers.provider.getBalance(
                      await fundme.getAddress(),
                  )
                  const startdeployerbalance = await ethers.provider.getBalance(
                      deployer,
                  )
                  //Act
                  const tnxres = await fundme.withdraw()
                  const tnxreciept = await tnxres.wait(1)
                  const {gasUsed, gasPrice} = tnxreciept
                  const gasCost = gasUsed * gasPrice
                  // const fee = tnxreciept.fee.toString()
                  // console.log(fee)

                  const endingfundmebalance = await ethers.provider.getBalance(
                      await fundme.getAddress(),
                  )
                  const endingdeployerbalance =
                      await ethers.provider.getBalance(deployer)
                  //Assert
                  assert.equal(endingfundmebalance.toString(), 0)
                  assert.equal(
                      (startfundmebalance + startdeployerbalance).toString(),
                      (endingdeployerbalance + gasCost).toString(),
                  )
              })
              it("allows us to withdraw with multiple funders", async () => {
                  //Arrange
                  const accounts = await ethers.getSigners()
                  // let startaccountsbalance = []
                  // let endaccountsbalance = []
                  // let fundmeconnectedcontract = []
                  // let gasCost = []
                  for (let i = 1; i < 6; i++) {
                      const fundmeconnectedcontract = await fundme.connect(
                          accounts[i],
                      )
                      await fundmeconnectedcontract.fund({
                          value: sendvalue,
                      })
                  }
                  const startfundmebalance = await ethers.provider.getBalance(
                      await fundme.getAddress(),
                  )
                  const startdeployerbalance = await ethers.provider.getBalance(
                      deployer,
                  )
                  // for (let i = 0; i < 6; i++) {
                  //     startaccountsbalance[i] = await ethers.provider.getBalance(
                  //         accounts[i].address,
                  //     )
                  // }
                  // console.log(startaccountsbalance)
                  for (let i = 0; i < 6; i++) {
                      console.log(await fundme.funders(i))
                      console.log(
                          (
                              await fundme.addressToAmountFunded(
                                  accounts[i].address,
                              )
                          ).toString(),
                      )
                  }
                  //Act
                  console.log(startdeployerbalance)
                  const tnxres = await fundme.withdraw()

                  const tnxreciept = await tnxres.wait(1)
                  const {gasUsed, gasPrice} = tnxreciept
                  const gasCost = gasUsed * gasPrice
                  // for (let i = 1; i < 6; i++) {
                  //     const tnxres = await fundmeconnectedcontract[i].withdraw()
                  //     const tnxreciept = await tnxres.wait(1)
                  //     const {gasUsed, gasPrice} = tnxreciept
                  //     gasCost[i] = gasUsed * gasPrice
                  // }

                  const endingfundmebalance = await ethers.provider.getBalance(
                      await fundme.getAddress(),
                  )
                  const endingdeployerbalance =
                      await ethers.provider.getBalance(deployer)
                  console.log(endingdeployerbalance)
                  // for (let i = 0; i < 6; i++) {
                  //     endaccountsbalance = await ethers.provider.getBalance(
                  //         accounts[i].address,
                  //     )
                  // }
                  //Assert
                  assert.equal(endingfundmebalance.toString(), 0)
                  assert.equal(
                      (startfundmebalance + startdeployerbalance).toString(),
                      (endingdeployerbalance + gasCost).toString(),
                  )
                  // for (let i = 0; i < 6; i++) {
                  //     assert.equal(
                  //         (startfundmebalance + startaccountsbalance[i]).toString(),
                  //         (endaccountsbalance[i] + gasCost[i]).toString(),
                  //     )
                  // }
                  //make sure that the funders are reset properly
                  await expect(fundme.funders(0)).to.be.reverted
                  for (let i = 1; i < 6; i++) {
                      assert.equal(
                          (
                              await fundme.addressToAmountFunded(
                                  accounts[i].address,
                              )
                          ).toString(),
                          0,
                      )
                  }
              })
              it("only allows the owner to withdraw", async () => {
                  const accounts = await ethers.getSigners()
                  const attacker = accounts[1]
                  const attackerconnectedcontract = await fundme.connect(
                      attacker,
                  )
                  await expect(
                      attackerconnectedcontract.withdraw(),
                  ).to.be.revertedWithCustomError(fundme, "FundMe__NotOwner")
              })
          })
      })
