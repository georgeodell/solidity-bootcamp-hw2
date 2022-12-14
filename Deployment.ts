import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { BytesLike, ethers } from "ethers";
import { Ballot, Ballot__factory } from "../typechain-types";
import * as dotenv from "dotenv";
dotenv.config();

async function main() {
    const provider = ethers.getDefaultProvider("goerli", {
        etherscan: process.env.ETHERSCAN_API_KEY,
        infura: process.env.INFURA_API_KEY,
        alchemy: process.env.ALCHEMY_API_KEY
    });

    const seed = process.env.MNEMONIC;
    const pKey = process.env.PRIVATE_KEY as string;

    // const wallet = ethers.Wallet.fromMnemonic(seed ?? "");
    const wallet = new ethers.Wallet(pKey);

    const signer = wallet.connect(provider);
    const balanceBN = await signer.getBalance();

    const args = process.argv;
    const proposals = args.slice(2);

    console.log("Deploying Ballot contract");
    console.log("Proposals: ");
    proposals.forEach((element, index) => {
        console.log(`Proposal N. ${index + 1}: ${element}`);
    });

    if (proposals.length <= 0) throw new Error("Not enough proposals");

    const ballotContractFactory = new Ballot__factory(signer);
    const ballotContract = await ballotContractFactory.deploy(proposals.map(prop => ethers.utils.formatBytes32String(prop))) as Ballot;
    await ballotContract.deployed();

    console.log(
        `The ballot contract was deployed at the address ${ballotContract.address}`
    );
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});