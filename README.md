# Get set up
Add a file named `config.json` with the following format.

```json
    {
        "PRIVATE_KEY": "",
        "SENDER_ADDRESS": "<address sending NFTs>",
        "RECEIVER_ADDRESS": "<address receiving NFTs>",
        "TOKENS": [
            //token_id:nat
        ]
    }
```

1. `PRIVATE_KEY` is the private key of the account you are planning to use to purchase art.
2. `TOKENS` are the list of tokenIDs, this is the natural number, can be found in Temple when selecting the NFT to transfer. The tokens are numbers and do not need to be in quotes (based on my testing)

`npm install`

## Run
1. In `index.ts` look for `transfer()` and set which contract you'd like to interact with
2. `npm run start`
