import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { BytesLike, ethers } from "ethers";
import { Ballot, Ballot__factory } from "../typechain-types";
import * as dotenv from "dotenv";
dotenv.config();

async function main() {
    const provider = ethers.getDefaultProvider("goerli");

    const seed = process.env.MNEMONIC;
    const pKey = process.env.PRIVATE_KEY as string;

    // const wallet = ethers.Wallet.fromMnemonic(seed ?? "");
    const wallet = new ethers.Wallet(pKey);

    const signer = wallet.connect(provider);
    const balanceBN = await signer.getBalance();
    
    const voterAddress = await signer.getAddress();

    const args = process.argv;
    const parameters = args.slice(2);

    if (parameters.length <= 0) throw new Error("Not enough arguments");
    else if (parameters.length > 2) throw new Error("Too many arguments");

    const contractAddress = parameters[0];
    const proposalIndex = parameters[1];

    console.log("Voting");
    console.log(`Contract Address: ${contractAddress}`);
    console.log(`Voter Address: ${voterAddress}`);
    console.log(`Proposal: ${proposalIndex}`);

    const ballotContractFactory = new Ballot__factory(signer);
    const ballotContract = ballotContractFactory.connect(signer).attach(contractAddress) as Ballot;

    await ballotContract.vote(proposalIndex);

    const proposal = await ballotContract.proposals(proposalIndex);
    const proposalName = ethers.utils.parseBytes32String(proposal.name);

    console.log(
        `${voterAddress} voted for ${proposalName}`
    );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});