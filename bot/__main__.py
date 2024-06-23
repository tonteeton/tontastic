import os

from aiogram import Bot, Dispatcher
from aiogram.client.default import DefaultBotProperties
from aiogram.fsm.storage.redis import RedisStorage
from aiogram_tonconnect.handlers import AiogramTonConnectHandlers
from aiogram_tonconnect.middleware import AiogramTonConnectMiddleware
from aiogram_tonconnect.tonconnect.storage.base import ATCRedisStorage
from aiogram_tonconnect.utils.qrcode import QRUrlProvider

from .handlers import router
from .throttling import ThrottlingMiddleware


BOT_TOKEN = "1234567890:QWERTYUIOPASDFGHJKLZXCVBNM"
REDIS_DSN = "redis://localhost:6379/0"
MANIFEST_URL = os.environ.get("MANIFEST_URL")
EXCLUDE_WALLETS = []


async def main():
    storage = RedisStorage.from_url(os.environ.get("REDIS_DSN", REDIS_DSN))
    # Creating a bot object with the token and HTML parsing mode
    bot = Bot(
        os.environ.get("BOT_TOKEN", BOT_TOKEN),
        default=DefaultBotProperties(parse_mode="HTML"),
    )

    await bot.delete_webhook()

    # Creating a dispatcher object using the specified storage
    dp = Dispatcher(storage=storage)

    dp.update.middleware.register(ThrottlingMiddleware())
    # Registering middleware for TON Connect processing
    dp.update.middleware.register(
        AiogramTonConnectMiddleware(
            storage=ATCRedisStorage(storage.redis),
            manifest_url=MANIFEST_URL,
            exclude_wallets=EXCLUDE_WALLETS,
            qrcode_provider=QRUrlProvider(),
        )
    )

    # Registering TON Connect handlers
    AiogramTonConnectHandlers().register(dp)

    # Including the router
    dp.include_router(router)

    # Starting the bot using long polling
    await dp.start_polling(bot)


if __name__ == "__main__":
    import asyncio

    asyncio.run(main())
