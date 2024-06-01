from enum import Enum
import os

from aiogram_tonconnect.tonconnect.transactions import TONTransferTransaction


class Vote(str, Enum):
    UP = "vote_up"
    DOWN = "vote_down"


VOTE_TRANSACTION_COST = 0.05


class VoteTransaction(TONTransferTransaction):
    def __init__(self, vote: Vote) -> None:
        super().__init__(
            address=os.environ["CONTRACT_ADDRESS"],
            amount=VOTE_TRANSACTION_COST,
            comment=vote.value,
        )
