// zx
export async function fetchData2() {
    const response = await fetch("./data/discipline.csv");
    const data = await response.text();
    return d3.csvParse(data);
}


