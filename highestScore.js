export default function highestScores(score) {
    var first = localStorage.getItem("1st") || 0;
    var second = localStorage.getItem("2nd") || 0;
    var third = localStorage.getItem("3rd") || 0;
    var fourth = localStorage.getItem("4th") || 0;
    var fifth = localStorage.getItem("5th") || 0;
    if (score > first) { fifth = fourth; fourth = third; third = second; second = first; first = score }
    else if (score > second) { fifth = fourth; fourth = third; third = second; second = score }
    else if (score > third) { fifth = fourth; fourth = third; third = score }
    else if (score > fourth) { fifth = fourth; fourth = score }
    else if (score > fifth) { fifth = score }
    localStorage.setItem("1st", first)
    localStorage.setItem("2nd", second)
    localStorage.setItem("3rd", third)
    localStorage.setItem("4th", fourth)
    localStorage.setItem("5th", fifth)
};