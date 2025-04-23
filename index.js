const Push = require("pushover-notifications");
const axios = require('axios');
const cheerio = require('cheerio');
const express = require('express');

const pushover = new Push({
    token: "acahusa3jfjmufof534rfk6p9o83kb", // Thay bằng API Token của bạn
    user: "u8uqzde69vsd6q72ha2mv5nq115hr6", // Thay bằng User Key của bạn
});

function sendNotification(message) {
    const msg = {
        message: message,
        title: "THÔNG BÁO TỪ CHECK FLIP",
        sound: "magic",
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


async function QuestRewardNear(url, statusReturn) {
    try {
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
                if (anchor.text().trim().includes("Stake $BRRR for BOOSTED Rewards")) { console.log("Bo qua the Stake $BRRR for BOOSTED Rewards.") }
                else {
                    sendNotification("Near Quest Reward.");
                    statusReturn = true;
                }
            }
        } else {
            console.log('Không tìm thấy thẻ Quest Near Reward.');
        }
    } catch (error) {
        console.error('Lỗi khi lấy HTML:', error.message);
    }
}

async function QuestRewardNear(url, statusReturn) {
    try {
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

    } catch (error) {
        console.error('Lỗi khi lấy HTML:', error.message);
    }
};

async function QuestRewardAptos(url, statusReturn) {
    try {
        const response = await axios.get(url);
        const $ = cheerio.load(response.data);
        $('h2').each((_, element) => {
            const text = $(element).text().trim();
            if (text.includes('Quests with Rewards')) {
                sendNotification("Aptos Quest Rewards.");
                statusReturn = true;
            }
        });
    } catch (error) {
        console.error('Lỗi khi lấy HTML:', error.message);
    }
};

// async function JourneysRewardAptos(url, statusReturn) {
//     try {
//         const response = await axios.get(url);
//         console.log(response.data)
//         const $ = cheerio.load(response.data);
//         const element = $('.p-3.bg-muted\\/60.rounded-lg.space-y-1').first();
//         console.log(element.length)
//       if (element.length) {
        
//         console.log('✅ Tìm thấy thẻ với class "text-white":');
//         console.log('👉 Nội dung:', element.text().trim());
//       } else {
//         console.log('❌ Không tìm thấy thẻ có class "text-white" trong thẻ đã chọn.');
//       }
//     } catch (error) {
//         console.error('Lỗi khi lấy HTML:', error.message);
//     }
// };

const app = express();
const port = 3000;

app.get('/', async (req, res) => {
    try {
        let statusReturn = false;
        await QuestRewardNear("https://flipsidecrypto.xyz/earn/near", statusReturn);
        await QuestRewardAptos("https://flipsidecrypto.xyz/earn/aptos", statusReturn);
        if (statusReturn) {
            sendNotification("+++++LAM VIEC THOI+++++.");
        }
    } catch (error) {
        sendNotification("----ERROR CALLING----")
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
