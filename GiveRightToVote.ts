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
  const parameters = args.slice(2);

  if (parameters.length <= 0) throw new Error("Not enough arguments");
  else if (parameters.length > 2) throw new Error("Too many arguments");

  const contractAddress = parameters[0];
  const voterAddress = parameters[1];

  console.log("Giving right to vote");
  console.log(`Contract Address: ${contractAddress}`);
  console.log(`Voter Address: ${voterAddress}`);

  const ballotContractFactory = new Ballot__factory(signer);
  const ballotContract = ballotContractFactory.connect(signer).attach(contractAddress) as Ballot;

  await ballotContract.giveRightToVote(voterAddress, { gasLimit: 10 ** 5 });

  console.log(
    `${voterAddress} was given the right to vote`
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});