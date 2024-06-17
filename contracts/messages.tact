message SetupMessage {
    tasticAddress: Address;
}

struct Vote {
    sender: Address;
    value: Int as int8;
}

// Jetton standard messages

message(0xf8a7ea5) TokenTransfer {
     queryId: Int as uint64;
     amount: Int as coins;
     destination: Address;
     responseDestination: Address?;
     customPayload: Cell?;
     forwardTonAmount: Int as coins;
     forwardPayload: Slice as remaining;
}

message(0xd53276db) TokenExcesses {
    queryId: Int as uint64;
}
