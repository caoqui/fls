const Push = require("pushover-notifications");
const axios = require('axios');
const cheerio = require('cheerio');
const express = require('express');

const pushover = new Push({
    token: "atro6g36tgv7ek9u7wh3tyr1h77bk2", // Thay bằng API Token của bạn
    user: "udepwd2q48g81u7kot2ivw549c9k54", // Thay bằng User Key của bạn
});

function sendNotification(message) {
    const msg = {
        message: message,
        title: "THÔNG BÁO TỪ CHECK FLIP",
        sound: "echo",
        priority: 1,
    };

    pushover.send(msg, function (err, result) {
        if (err) {
            console.error("Gửi thông báo thất bại:", err);
        } else {
            console.log("Thông báo đã gửi:", result);
        }
    });
}

async function QuestRewardNear(url) {
    try {
        let statusReturn = false;
        const response = await axios.get(url);
        //   console.log(response.data);
        const $ = cheerio.load(response.data);
        // Tìm thẻ theo class chính xác
        const questRewardNear = $('.grid.grid-cols-4.gap-6.py-6').first();

        if (questRewardNear.length) {
            const childCount = questRewardNear.children().length;
            if (childCount > 1) {
                sendNotification("Near Quest Reward.");
                statusReturn = true;
            }
            else if (childCount > 0) {
                const anchor = questRewardNear.children().find('a').eq(1);
                if (anchor.text().trim().includes("Stake $BRRR for BOOSTED Rewards")) { console.log("Bo qua the Stake $BRRR.") }
                else {
                    sendNotification("Near Quest Reward.");
                    statusReturn = true;
                }
            }
        } else {
            console.log('Không tìm thấy thẻ Quest Near Reward.');
        }
        // Journeys
        $('h2').each((_, element) => {
            const text = $(element).text().trim();
            if (text.includes('Journeys')) {
                sendNotification("Near Journeys Reward.");
                statusReturn = true;
            }
        });
        return statusReturn;
    } catch (error) {
        console.error('Lỗi khi lấy HTML:', error.message);
    }
};

async function QuestRewardAptos(url) {
    try {
        let statusReturn = false;
        const response = await axios.get(url);
        const $ = cheerio.load(response.data);
        $('h2').each((_, element) => {
            const text = $(element).text().trim();
            if (text.includes('Quests with Rewards')) {
                sendNotification("Aptos Quest Rewards.");
                statusReturn = true;
            }
        });
        return statusReturn;
    } catch (error) {
        console.error('Lỗi khi lấy HTML:', error.message);
    }
};

async function QuestRewardStellar(url, statusReturn) {
    try {
        const response = await axios.get(url);
        const $ = cheerio.load(response.data);
        $('h2').each((_, element) => {
            const text = $(element).text().trim();
            if (text.includes('Quests with Rewards')) {
                sendNotification("Stellar Quest Rewards.");
                statusReturn = true;
            }
        });
    } catch (error) {
        console.error('Lỗi khi lấy HTML:', error.message);
    }
};

// bỏ qua quest Lend on Blend - YieldBlox Pool 
async function QuestRewardStellar2(url) {
    try {
        let statusReturn = false;
        const response = await axios.get(url);
        const $ = cheerio.load(response.data);
        const parentDiv = $('div.grid.grid-cols-4.gap-6.py-6');
        if (parentDiv.children().length > 4) {
            sendNotification("Stellar Quest Rewards.");
            statusReturn = true;
        } else {
            const matchText = [
                // 'Lend on Blend - YieldBlox Pool',
                // 'Borrow on Blend - YieldBlox V2 Pool',
                // 'Swap USDC for PHO on Phoenix',
                // 'Provide Liquidity to PHO-USDC on Phoenix'
            ];
            parentDiv.children().each((i, child) => {
                const text = $(child).find('a').eq(1).text().trim();
                let allMatch = true;
                // console.log('Link text:', text);
                if (!matchText.includes(text)) {
                    allMatch = false; // Có ít nhất 1 cái không khớp
                }
                // }

                if (!allMatch) {
                    sendNotification("Stellar Quest Rewards2.");
                    statusReturn = true;
                }
            });
        }
        return statusReturn;
    } catch (error) {
        console.error('Lỗi khi lấy HTML:', error);
    }
}
async function CheckBalanceStellarQuestReward(url, arrayReward) {
    try {
        let statusReturn = false;
        const response = await axios.get(url);
        const $ = cheerio.load(response.data);
        const parentDiv = $('ul.grid.grid-cols-1.md\\:grid-cols-2.lg\\:grid-cols-3.gap-3');

        parentDiv.children().each((i, child) => {
            const whiteTextEl = $(child).find('.text-white'); // tìm thẻ có class text-white bên trong child
            const text = whiteTextEl.text().trim();
            let allMatch = true;
            // console.log('Link text:', text);
            if (!arrayReward.includes(text)) {
                allMatch = false;
            }

            if (!allMatch) {
                sendNotification("Stellar REWARD giam.");
                statusReturn = true;
            }
        });

        return statusReturn;
    } catch (error) {
        console.error('Lỗi khi lấy HTML:', error);
    }
}
async function CheckBalanceBobaQuestReward(url, arrayReward) {
    try {
        let statusReturn = false;
        const response = await axios.get(url);
        const $ = cheerio.load(response.data);
        const parentDiv = $('ul.grid.grid-cols-1.md\\:grid-cols-2.lg\\:grid-cols-3.gap-3');

        parentDiv.children().each((i, child) => {
            const whiteTextEl = $(child).find('.text-white'); // tìm thẻ có class text-white bên trong child
            const text = whiteTextEl.text().trim();
            // console.log("In: ", text)
            let allMatch = true;
            // console.log('Link text:', text);
            if (!arrayReward.includes(text)) {
                if (text == "4000 BOBA" || text == "6000 BOBA" || Number(text.split(" ")[0]) > 6000)
                    allMatch = false;
            }

            if (!allMatch) {
                sendNotification("REWAR BOBA DUOC BOM...");
                statusReturn = true;
            }
        });

        return statusReturn;
    } catch (error) {
        console.error('Lỗi khi lấy HTML:', error);
    }
}

// need to fix
async function JourneysBoba(url) {
    let statusReturn = false;
    try {
        const response = await axios.get(url);
        const $ = cheerio.load(response.data);
        const parentDiv = $("ul.grid.grid-cols-1.md\\:grid-cols-2.lg\\:grid-cols-3.gap-3");
        console.log(parentDiv)
        parentDiv.children().each((i, child) => {
            console.log(1)
        }) 

    } catch (error) {
        console.error('Lỗi khi lấy HTML:', error);
    }
};
async function QuestRewardBoba2(url) {
    try {
        let statusReturn = false;
        const response = await axios.get(url);
        const $ = cheerio.load(response.data);
        const parentDiv = $('div.grid.grid-cols-4.gap-6.py-6');
        if (parentDiv.children().length > 4) {
            sendNotification("Boba Quest Rewards.");
            statusReturn = true;
        } else {
            const matchText = [
                'Bridge from Base to Boba via Symbiosis',
                'Deposit ETH with RubyScore',
                'Open position on Lynx - BOBA',
            ];
            parentDiv.children().each((i, child) => {
                const text = $(child).find('a').eq(1).text().trim();
                let allMatch = true;
                // console.log('Link text:', text);
                if (!matchText.includes(text)) {
                    allMatch = false; // Có ít nhất 1 cái không khớp
                }
                // }

                if (!allMatch) {
                    sendNotification("Stellar Quest Rewards2.");
                    statusReturn = true;
                }
            });
        }
        return statusReturn;
    } catch (error) {
        console.error('Lỗi khi lấy HTML:', error);
    }
}
async function JourneysStellar(url) {
    let statusReturn = false;
    try {
        const response = await axios.get(url);
        const $ = cheerio.load(response.data);
        const h2 = $('h2.text-3xl').filter((_, el) => {
            return $(el).text().trim() === 'Onboarding #1 - Bridge Stablecoins to Stellar';
        }).first();

        if (!h2.length) {
            console.log('❌ Không tìm thấy thẻ <h2> khớp nội dung');
            return;
        }

        console.log('✅ Tìm thấy thẻ <h2>:');
        console.log($.html(h2));

    } catch (error) {
        console.error('Lỗi khi lấy HTML:', error.message);
    }
};

const app = express();
const port = 3000;

app.get('/', async (req, res) => {

    return res.send("Starting");
});

app.get('/check', async (req, res) => {
    try {
        // let statusReturn1 = await QuestRewardAptos("https://flipsidecrypto.xyz/earn/aptos");
        let statusReturn2 = await QuestRewardStellar2("https://flipsidecrypto.xyz/earn/stellar");
        let statusReturn3 = await QuestRewardNear("https://flipsidecrypto.xyz/earn/near");
        // let statusReturn4 = await CheckBalanceStellarQuestReward("https://flipsidecrypto.xyz/earn/quest/lend-on-blend-yieldblox-pool", ['200 USDC', '1200 USDC', '750 USDC']);
        // let statusReturn5 = await CheckBalanceStellarQuestReward("https://flipsidecrypto.xyz/earn/quest/borrow-on-blend-yieldblox-v2-pool", ['200 USDC', '1200 USDC', '1500 USDC']);
        // let statusReturn6 = await CheckBalanceStellarQuestReward("https://flipsidecrypto.xyz/earn/quest/swap-usdc-for-pho-on-phoenix", ['100 USDC', '0 USDC', '0 USDC']);
        // let statusReturn7 = await CheckBalanceStellarQuestReward("https://flipsidecrypto.xyz/earn/quest/provide-liquidity-to-pho-usdc-on-phoenix", ['100 USDC', '0 USDC', '0 USDC']);

        let statusReturn8 = await CheckBalanceBobaQuestReward("https://flipsidecrypto.xyz/earn/quest/open-position-on-lynx-lvkqhn", ['0 BOBA', '5547.9732197094 BOBA', '0 BOBA']);
        let statusReturn9 = await CheckBalanceBobaQuestReward("https://flipsidecrypto.xyz/earn/quest/deposit-eth-with-rubyscore", ['0 BOBA', '1154.3756858666 BOBA', '0 BOBA']);
        // let statusReturn10 = await JourneysBoba("https://flipsidecrypto.xyz/earn/journey/boba-bridge-lp-journey-d3bCh");
        let statusReturn10 = await QuestRewardBoba2("https://flipsidecrypto.xyz/earn/boba");

        if (statusReturn2 || statusReturn3 || statusReturn8 || statusReturn9 || statusReturn10) {
            setInterval(() => {
                sendNotification("+++++LAM VIEC THOI+++++.");
            }, 5000)
            console.log("RUNING...")
        }
    } catch (error) {
        sendNotification("----ERROR CALLING----")
        console.log(error)
    }

    return res.send("Called successfully!");
});

app.get('/test', async (req, res) => {
    sendNotification("Test.")

    return res.send("Test");
});


app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
