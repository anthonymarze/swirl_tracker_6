export const basinNames = (abbreviation) => {
    let firstWord = "";
    let lastWord = "";

    switch (abbreviation[0]) {
        case 'E':
            firstWord = "East";
            break;
        case 'W':
            firstWord = "West";
            break;
        case 'N':
            firstWord = "North";
            break;
        case 'S':
            firstWord = "South";
            break;
        default:
            firstWord = abbreviation[0];
            break;
    }

    switch (abbreviation[1]) {
        case 'A':
            lastWord = "Atlantic";
            break;
        case 'P':
            lastWord = "Pacific";
            break;
        case 'I':
            lastWord = "Indian";
            break;
        default:
            lastWord = abbreviation[1];
            break;
    }

    let finalName = firstWord + " " + lastWord;
    return finalName;
};