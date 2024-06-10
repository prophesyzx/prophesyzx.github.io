import { fetchData2 } from './data.js';
import { drawChart1 } from './chart1.js';
import { drawChart2 } from './chart2.js';
import { drawChart3 } from './chart3.js';
import { drawChart4 } from './chart4.js';

document.addEventListener('DOMContentLoaded', async () => {
    const data2 = await fetchData2();
    drawChart1();
    drawChart2(data2);
    drawChart3();
    drawChart4();
});


