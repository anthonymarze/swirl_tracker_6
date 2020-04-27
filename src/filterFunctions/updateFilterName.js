export default function updateFilterName(filter, name) {
    filter[3][1] = name;
    const newFilter = filter;

    if(name !== "") {
        document.getElementById("name").style.border = "2px solid red";
    } else {
        document.getElementById("name").style.border = "1px solid #696966";
    }

    return newFilter;
}