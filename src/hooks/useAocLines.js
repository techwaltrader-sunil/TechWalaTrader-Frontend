import { useEffect } from 'react';

export const useAocLines = (chartRef, aocStats, marketMetrics, chainData, showMagicalLines) => {
    
    useEffect(() => {
        if (!chartRef.current || !aocStats || !marketMetrics || !chainData || chainData.length === 0) return;

        const chart = chartRef.current;
        
        // 🚨 1. सबसे पहले पुरानी लाइनें साफ़ करो
        chart.removeOverlay({ groupId: 'aoc_magic_lines' });

        // 🛑 2. अगर टॉगल OFF है, तो यहीं से वापस लौट जाओ! 
        if (!showMagicalLines) return; 

        const resStrike = aocStats.CE?.Volume?.max?.strike;
        const supStrike = aocStats.PE?.Volume?.max?.strike;
        const maxPain = marketMetrics.maxPain;

        // 🌟 डायनामिक Strike Gap निकालें 
        const strikeGap = chainData.length >= 2 
            ? Math.abs(Number(chainData[1].strike) - Number(chainData[0].strike)) 
            : 50;

        // 🌟 Resistance (CE) और Support (PE) का लाइव प्रीमियम (LTP) निकालें
        let ceLtp = 0;
        let peLtp = 0;

        if (resStrike) {
            const resRow = chainData.find(r => Number(r.strike) === Number(resStrike));
            if (resRow) ceLtp = parseFloat(resRow.CE?.ltp || 0);
        }
        if (supStrike) {
            const supRow = chainData.find(r => Number(r.strike) === Number(supStrike));
            if (supRow) peLtp = parseFloat(supRow.PE?.ltp || 0);
        }

        // 🧮 THE MAGICAL MATH (Calculate Extensions)
        const eor = resStrike ? Math.round(resStrike + ceLtp) : 0; 
        const eos = supStrike ? Math.round(supStrike - peLtp) : 0; 
        
        const rSafe = resStrike ? resStrike + strikeGap : 0; 
        const sSafe = supStrike ? supStrike - strikeGap : 0; 

        // 🧠 Grouping Logic (Collision Fix)
        const priceGroups = {};

        const addToGroup = (price, text, color, isDashed) => {
            if (!price || price === 0) return;
            
            if (!priceGroups[price]) {
                priceGroups[price] = {
                    price: price, color: color, lineStyle: isDashed ? 'dashed' : 'solid', labels: []
                };
            }
            
            const currentLabelsCount = priceGroups[price].labels.length;
            const offset = 120 + (currentLabelsCount * 140); 
            
            priceGroups[price].labels.push({ text, color, offset });
        };

        // 🔴 RESISTANCE ZONE
        addToGroup(rSafe, `R Safe: ${rSafe}`, '#b71c1c', false);          
        addToGroup(eor, `R Risky (EoR): ${eor}`, '#ef5350', true);        
        addToGroup(resStrike, `R Moderate: ${resStrike}`, '#ef5350', false); 

        // 🔵 NEUTRAL ZONE
        addToGroup(maxPain, `Max Pain: ${maxPain}`, '#2962ff', true);      

        // 🟢 SUPPORT ZONE
        addToGroup(supStrike, `S Moderate: ${supStrike}`, '#26a69a', false); 
        addToGroup(eos, `S Risky (EoS): ${eos}`, '#26a69a', true);        
        addToGroup(sSafe, `S Safe: ${sSafe}`, '#004d40', false);          

        // 🚀 5. चार्ट पर ड्रा करें
        Object.values(priceGroups).forEach((group, index) => {
            chart.createOverlay({
                name: 'aocLevelLine',
                id: `aoc_magic_${index}`,
                groupId: 'aoc_magic_lines',
                extendData: { 
                    color: group.color, 
                    lineStyle: group.lineStyle, 
                    labels: group.labels 
                },
                points: [{ value: group.price }]
            });
        });

    }, [chartRef, aocStats, marketMetrics, chainData, showMagicalLines]); 
};