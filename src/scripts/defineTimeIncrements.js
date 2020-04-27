export default function defineTimeIncrements(increments) {
    increments.forEach(increment => {
        const node = document.createElement("P");
        node.className = "month noselect";
        node.innerHTML = increment;
    
        document.getElementById("time-increments-box").appendChild(node);
    })
}