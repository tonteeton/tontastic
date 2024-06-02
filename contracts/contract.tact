import "@stdlib/ownable";
import "@stdlib/deploy";
import "./protocol.tact";

message(0xf8a7ea5) TokenTransfer {
     queryId: Int as uint64;
     amount: Int as coins;
     destination: Address;
     responseDestination: Address?;
     customPayload: Cell?;
     forwardTonAmount: Int as coins;
     forwardPayload: Slice as remaining;
}


contract DemoContract with Deployable, UsesPriceOracle, Ownable {
    owner: Address;
    votes: map<Address, Bool>; // true - UP, false - DOWN

    priceOracleAddress : Address;

    startDate: Int as uint64;
    finishDate: Int as uint64;
    isStarted: Bool;
    price24Change: Int as int64;

    init(priceOracleAddress: Address) {
        self.owner = sender();
        self.priceOracleAddress = priceOracleAddress;
        self.startDate = 0;
        self.finishDate = 0;
        self.isStarted = false;
        self.price24Change = 0;
    }

    override fun requestPriceFromOracle() {
        send(SendParameters{
            to: self.priceOracleAddress,
            body: OraclePriceRequest{
                queryID: 1,
                ticker: self.TICKER_TON,
                minUpdatedAt: now() - 3600 // Price must be no older than 1 hour.
            }.toCell(),
            value: ton("0.01"),
            mode: SendRemainingValue | SendIgnoreErrors,
            bounce: false
        });
        emit("Price request sended to oracle".asComment());
    }

    override fun receivedOraclePriceResponse(msg: OraclePriceResponse) {
        require(sender() == self.priceOracleAddress, "Oracle sender required");
        if (!self.isStarted) {
            self.startQuiz(msg.usd);
        } else {
            self.finishQuiz(msg.usd);
        }
    }

    override fun receivedOraclePriceScheduledResponse(msg: OraclePriceScheduledResponse) {
        emit("Oracle price is outdated".asComment());
    }


    fun startQuiz(price: Int) {
        self.price24Change = 0;
        self.isStarted = true;
    }

    fun finishQuiz(price24Change: Int) {
        self.price24Change = price24Change;
        self.finishDate = now();
        self.isStarted = false;
        emit("Quiz finished".asComment());
    }

    fun reward() {
        send(SendParameters{           
            to: address("EQDWRudbmwfSnLKhnVClJDD08W7Xn_08UQtJxwOx3YInIkm7"),
            body: TokenTransfer{
                queryId: 0,
                amount: 1,
                destination: sender(),
                responseDestination: sender(),
                customPayload: null,
                forwardTonAmount: ton("0.01"),
                forwardPayload: emptySlice()
            }.toCell(),
            value: ton("0.01"),
            bounce: false
        });
   }

    receive ("callOracle") {
        emit("callOracle".asComment());
        self.requestPriceFromOracle();
    }

    receive ("vote_up") {
        self.votes.set(sender(), true);
        self.reply("Vote for price UP today".asComment());
    }

    receive ("vote_down") {
        self.votes.set(sender(), false);
        self.reply("Vote for price DOWN today".asComment());
    }

    receive ("collect") {
        require(self.votes.get(sender()) != null, "No vote");
        let vote : Bool = self.votes.get(sender())!!;
        if (
            (vote && self.price24Change > 0) ||
                (!vote && self.price24Change < 0)
        ) {
            self.votes.set(sender(), null);
            self.reward()
            emit("collected".asComment());
        } else {
            self.votes.set(sender(), null);
            emit("wrong answer".asComment());
        }
    }

    receive ("startQuiz") {
        self.requireOwner();
        self.votes = emptyMap();
        self.requestPriceFromOracle();
        emit("startQuiz".asComment());
    }

    receive ("finishQuiz") {
        self.requireOwner();
        emit("finishQuiz".asComment());
        self.requestPriceFromOracle();
    }

    receive (text: String) {
    }

}
