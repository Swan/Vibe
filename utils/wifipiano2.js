function wifipiano2(scoreData) {
    console.log(`[WIFIPIANO2] SCORE DATA: Star Rating: ${scoreData.starRating}, OD: ${scoreData.overallDifficulty}, Objects: ${scoreData.objects}, Mods: ${scoreData.mods}, Score: ${scoreData.score}, Acc: ${scoreData.accuracy}`);

    /*
     * Strain PP
    */

    let scoreMultiplier = 1.0;

    // Calculate Strain PP
    let strainPP;
    if (scoreMultiplier <= 0) {
        strainPP = 0;
    } else {
        scoreData.score *= 1.0 / scoreMultiplier;
        strainPP = Math.pow(5.0 * Math.max(1.0, scoreData.starRating / 0.0825) - 4.0, 3.0) / 110000.0;
        strainPP *= 1 + 0.1 * Math.min(1.0, scoreData.objects / 1500.0);
        
        if (scoreData.score <= 500000) {
            strainPP *= (scoreData.score / 500000.0) * 0.1;

        } else if (scoreData.score <= 600000) {
            strainPP *= 0.1 + (scoreData.score - 500000) / 100000.0 * 0.2;

        } else if (scoreData.score <= 700000) {
            strainPP *= 0.3 + (scoreData.score - 600000) / 100000.0 * 0.35;

        } else if (scoreData.score <= 800000) {
            strainPP *= 0.65 + (scoreData.score - 700000) / 100000.0 * 0.2;

        } else if (scoreData.score <= 900000) {
            strainPP *= 0.85 + (scoreData.score - 800000) / 100000.0 * 0.1;

        } else {
            strainPP *= 0.95 + (scoreData.score - 900000) / 100000.0 * 0.05;
        }
        
    }

    /*
     * Accuracy PP
     */

    // Calculate hitWindow depending on what game modws are provided.
    let hitWindow300 = (34 + 3 * scoreData.overallDifficulty);
    /*switch (mods) {
        case 'ez':
            hitWindow300 *= 1.4;
            break;
        case 'dt':
            hitWindow300 *= 1.5;
            break;
        case 'ht':
            hitWindow300 *= 0.75;
            break;
        case 'none':
            break;
    }*/

    // Makes hitWindow match what's ingame.
    hitWindow300 += 0.5;
  
    /*switch (mods) {
        case 'dt':
            hitWindow300 /= 1.5;
            break;
        case 'ht':
            hitWindow300 /= 0.75;
    }*/

    let accPP = Math.pow((150.0 / hitWindow300) * Math.pow(scoreData.accuracy / 100, 16.0), 1.8) * 2.5;
    accPP = accPP * Math.min(1.15, Math.pow(scoreData.objects / 1500.0, 0.3));

    // Calc multiplier based on certain mods.
    let multiplier = 1.1;
    /*switch (mods) {
        case 'nf':
            mutliplier *= 0.9;
            break;
        case 'ez':
            multiplier *= 0.5;
            break;
    }*/

    // Calculate total performance points.
    let pp = Math.pow(Math.pow(strainPP, 1.1) + Math.pow(accPP, 1.1), 1.0 / 1.1) * multiplier;
    console.log(`[WIFIPIANO2] Calculated PP ${pp}`);
}


let scoreData = {
    starRating: 11.9, 
    overallDifficulty: 1, 
    objects: 1878,
    mods: 'none',
    score: 869471, 
    accuracy: 97.32
};
wifipiano2(scoreData);