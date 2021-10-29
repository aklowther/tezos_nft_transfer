import { WalletOperationBatch, TezosToolkit, Wallet, ContractAbstraction } from "@taquito/taquito";
import { InMemorySigner } from "@taquito/signer";
import winston from "winston";

import {
  PRIVATE_KEY,
  SENDER_ADDRESS,
  RECEIVER_ADDRESS,
  TOKENS
} from "./config.json";

const logger = winston.createLogger({
  level: "debug",
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      ),
    }),
  ],
});

enum ContractAddress {
  EMPTY = "",
  TEZERFLY = "KT1Xqiz99Q5mLebyERrPjAhVodysyebkhYFb",
  PIXELPOTUS = "KT1WGDVRnff4rmGzJUbdCRAJBmYt12BrPzdD",
  TREX = "KT1EpGgjQs73QfFJs9z7m1Mxm5MTnpC2tqse",
  MOMENTS = "KT1CNHwTyjFrKnCstRoMftyFVwoNzF6Xxhpy",
  FEDELTA_BOY = "KT1EpGgjQs73QfFJs9z7m1Mxm5MTnpC2tqse"
}

const PUBLIC_NODE_ADDRESS = "https://mainnet-node.madfish.solutions/";
const Tezos = new TezosToolkit(PUBLIC_NODE_ADDRESS);
Tezos.setProvider({ signer: new InMemorySigner(PRIVATE_KEY) });

function appendContractCall(token: number, batch: WalletOperationBatch, contract: ContractAbstraction<Wallet>): WalletOperationBatch {
  return batch.withContractCall(contract.methods.transfer(
    [
      {
        "from_": SENDER_ADDRESS,
        "txs": [
          {
            "to_": RECEIVER_ADDRESS,
            "amount": 1,
            "token_id": token
          }
        ]
      }
    ]))
}

async function transfer() {
  let contract = await Tezos.wallet.at(ContractAddress.EMPTY).catch((error) => {
    logger.debug("Failed to create wallet, " + JSON.stringify(error["message"]));
    logger.debug("\n\n\n********************");
    logger.debug("1. if you received error 'Request to ... failed', please verify your node is online and up to date");
    logger.debug("2. if you received error 'Failed to parsed an argument in path', please verify you selected a valid contract address");

    process.exit();
  });

  let contractCast = contract as ContractAbstraction<Wallet>
  let batch = Tezos.wallet.batch();
  TOKENS.forEach((token) => {
    batch = appendContractCall(token, batch, contractCast)
  });

  batch
    .send()
    .then((op) => {
      logger.debug(`Hash: ${op.opHash}`);
      return op.confirmation();
    })
    .then((result) => {
      console.log(result);
      if (result.completed) {
        logger.debug(`Transaction correctly processed!\nBlock: ${result.block.header.level}\nChain ID: ${result.block.chain_id}`);
      } else {
        logger.debug('An error has occurred');
      }
    })
    .catch((err) => console.log(err));
}

transfer();
