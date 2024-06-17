import "@stdlib/deploy";
import "@stdlib/ownable";
import "./oracleProtocol.tact";
import "./messages.tact";

contract DemoContract with Deployable, Ownable, UsesPriceOracle {
    owner: Address;

    priceOracleAddress : Address;
    tasticJettonWallet: Address;
    jettonTransferCount: Int as uint64;

    init(priceOracleAddress: Address) {
        self.owner = sender();
        self.priceOracleAddress = priceOracleAddress;
        self.tasticJettonWallet = myAddress();
        self.jettonTransferCount = 0;
    }

    // Set the Jetton wallet address for this contract.
    receive (msg: SetupMessage) {
        self.requireOwner();
        self.tasticJettonWallet = msg.tasticAddress;
    }

    receive ("vote_up") {
        self.vote(1);
    }

    receive ("vote_down") {
        self.vote(-1);
    }

    receive ("withdrawBalance") {
        self.requireOwner();
        send(SendParameters{
            to: self.owner,
            bounce: true,
            value: 0,
            mode: SendRemainingBalance + SendIgnoreErrors
        });
    }

    receive (msg: TokenExcesses) {
    }

    receive (text: String) {
    }

    fun vote(value: Int) {
        send(SendParameters{
            to: self.priceOracleAddress,
            value: 0,
            mode: SendRemainingValue,
            bounce: false,
            body: OraclePriceRequest{
                queryId: 1,
                // User vote is sent as payload
                customPayload: Vote{
                    sender: sender(),
                    value: value,
                }.toCell(),
                ticker: self.TICKER_TON,
                minUpdatedAt: now() - 18000, // Price must be no older than 5 hours.
            }.toCell(),
        });
    }

    // Handle response from the oracle containing price data.
    override fun receivedOraclePriceResponse(msg: OraclePriceResponse) {
        let vote : Vote = self.parseVote(msg.payload!!);
        if ((msg.usd24change >= 0 && vote.value > 0) || (msg.usd24change <= 0 && vote.value < 0)) {
            self.sendTastic(vote.sender, ton("1"), "TONtastic!");
        } else {
            self.sendText(vote.sender, "Nope");
        }
    }

    // Handle scheduled response from the oracle indicating outdated price data.
    override fun receivedOraclePriceScheduledResponse(msg: OraclePriceScheduledResponse) {
        let vote : Vote = self.parseVote(msg.payload!!);
        // The price is currently unknown. Let's reward the User with half a TASTIC.
        self.sendTastic(vote.sender, ton("0.5"), "¯\\_(ツ)_/¯");
    }

    fun parseVote(cell: Cell): Vote {
        let payload: Slice = cell.beginParse();
        return Vote{
            sender: payload.loadAddress(),
            value: payload.loadInt(8),
        };
    }

    fun sendText(to: Address, text: String) {
        send(SendParameters{
            to: to,
            value: 0,
            mode: SendRemainingValue | SendIgnoreErrors,
            bounce: false,
            body: text.asComment(),
        });
    }

    fun sendTastic(to: Address, amount: Int, comment: String) {
        self.jettonTransferCount += 1;
        let queryId: Int = self.jettonTransferCount;

        // Comment for the Jetton Notify transaction.
        let payload: Slice =
            beginCell().
            storeUint(0, 32). // 0x0 - text comment
            storeUint(0, 1).  // 0x0 - text is stored in this cell
            storeSlice(comment.asSlice()).
            endCell().
            asSlice();

        send(SendParameters{
            to: self.tasticJettonWallet,
            value: 0,
            mode: SendRemainingValue,
            bounce: false,
            body: TokenTransfer{
                queryId: queryId,
                amount: amount, // TASTIC amount
                destination: to,
                responseDestination: to, // return remaining coins to User
                customPayload: null,
                forwardTonAmount: 1,
                forwardPayload: payload,
            }.toCell(),
        });
    }
}
