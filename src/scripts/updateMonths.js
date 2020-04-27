export default function updateMonths(month, months) {

    // REMOVES EMPTY STRING AT START OF NEW CYCLE //

    if (months.includes("")) {
        months = [];
    }

    if (!months.includes(month.innerHTML)) {
        months.push(month.innerHTML);
        month.style.color = "red";

    } else {
        let monthIdx = months.indexOf(month.innerHTML);
        months.splice(monthIdx, 1);
        month.style.color = "black";

        // LEAVE EMPTY STRING IF EMPTY //

        if (months.length === 0) {
            months.push("")
        }
    }

    return months;
}