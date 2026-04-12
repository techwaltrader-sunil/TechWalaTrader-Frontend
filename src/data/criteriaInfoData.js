// File: src/data/criteriaInfoData.js

export const criteriaInfoData = {
    'ATM pt': {
        en: { title: "📍 ATM / ITM / OTM (Points)", desc: "Selects strike based on exact point distance from the Spot Price (e.g., ITM 100)." },
        hi: { title: "📍 ATM / ITM / OTM (Points)", desc: "स्पॉट प्राइस (Spot Price) से पॉइंट्स की दूरी के आधार पर स्ट्राइक चुनता है (जैसे ITM 100)।" }
    },
    'ATM %': {
        en: { title: "📍 ATM / ITM / OTM (%)", desc: "Selects strike based on percentage distance from the Spot Price (e.g., OTM 1%)." },
        hi: { title: "📍 ATM / ITM / OTM (%)", desc: "स्पॉट प्राइस से प्रतिशत (%) की दूरी के आधार पर स्ट्राइक चुनता है (जैसे OTM 1%)।" }
    },
    'Delta': {
        en: { title: "⚡ Delta (0 to 1)", desc: "Option speed. 0.4 Delta means 1 Pt move in Index = 0.40 Pt premium move. (Smart Money choice)" },
        hi: { title: "⚡ Delta (0 to 1)", desc: "ऑप्शन की स्पीड। 0.4 Delta का मतलब है इंडेक्स 1 पॉइंट हिलेगा तो प्रीमियम 0.40 पॉइंट बढ़ेगा। (SMC ट्रेडर्स की पसंद)" }
    },
    'CP': {
        en: { title: "💰 Premium (CP)", desc: "Closest Premium. Selects the strike with live premium closest to your target (e.g., ₹150)." },
        hi: { title: "💰 Premium (CP)", desc: "सबसे करीबी प्रीमियम। लाइव स्कैन करके वो स्ट्राइक चुनता है जिसका प्रीमियम आपके टारगेट (जैसे ₹150) के सबसे करीब हो।" }
    },
    'CP >=': {
        en: { title: "📈 Premium (CP >=)", desc: "Selects the cheapest strike whose premium is Greater Than or Equal to your target." },
        hi: { title: "📈 Premium (CP >=)", desc: "वो सबसे सस्ती स्ट्राइक चुनता है जिसका प्रीमियम आपके टारगेट के बराबर या उससे ज्यादा हो।" }
    },
    'CP <=': {
        en: { title: "📉 Premium (CP <=)", desc: "Selects the most expensive strike whose premium is Less Than or Equal to your target." },
        hi: { title: "📉 Premium (CP <=)", desc: "वो सबसे महंगी स्ट्राइक चुनता है जिसका प्रीमियम आपके टारगेट के बराबर या उससे कम हो।" }
    }
};