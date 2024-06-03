// zx
export async function fetchData2() {
    const response = await fetch("../data/discipline.csv");
    const data = await response.text();
    return d3.csvParse(data);
}

export async function fetchData4() {
    const response = await fetch("../data/pub_compare.csv");
    const data = await response.text();
    return d3.csvParse(data);
}

