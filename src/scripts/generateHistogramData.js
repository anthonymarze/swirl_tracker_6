export default function generateHistogramData(selectedFeautres) {
    let sortedTuples = [];
    selectedFeautres.forEach(feature => {
        let histoMonth;
        let month = feature.properties.month

        switch (month) {
            case "January":
                histoMonth = 1;
                break;
            case "February":
                histoMonth = 2;
                break;
            case "March":
                histoMonth = 3;
                break;
            case "April":
                histoMonth = 4;
                break;
            case "May":
                histoMonth = 5;
                break;
            case "June":
                histoMonth = 6;
                break;
            case "July":
                histoMonth = 7;
                break;
            case "August":
                histoMonth = 8;
                break;
            case "September":
                histoMonth = 9;
                break;
            case "October":
                histoMonth = 10;
                break;
            case "November":
                histoMonth = 11;
                break;
            case "December":
                histoMonth = 12;
                break;
            default:
                histoMonth = 13;
                break;
        }

        sortedTuples.push([histoMonth, feature.properties.intensity]);
    })

    // sortedTuples = sortedTuples.sort();

    //

    let sortedHistogramByMonth = [];
    let monthlyDistribution = [0, 0, 0, 0, 0, 0, 0];
    let histoIntensity;
    
    for(let i = 1; i < 13; i++) {
        sortedTuples.forEach(tuple => {
            if (i === tuple[0]) {
                switch (tuple[1]) {
                    case "TD":
                        histoIntensity = 0;
                        break;
                    case "TS":
                        histoIntensity = 1;
                        break;
                    case "1":
                        histoIntensity = 2;
                        break;
                    case "2":
                        histoIntensity = 3;
                        break;
                    case "3":
                        histoIntensity = 4;
                        break;
                    case "4":
                        histoIntensity = 5;
                        break;
                    case "5":
                        histoIntensity = 6;
                        break;
                    default:
                        histoIntensity = 7;
                        break;
                }

                monthlyDistribution[histoIntensity]++;
            }
        })

        sortedHistogramByMonth = sortedHistogramByMonth.concat(monthlyDistribution);
        monthlyDistribution = [0, 0, 0, 0, 0, 0, 0];
    }

    return sortedHistogramByMonth
}