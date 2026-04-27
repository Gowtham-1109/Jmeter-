/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 100.0, "KoPercent": 0.0};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.6715116279069767, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.2647058823529412, 500, 1500, "signup-135"], "isController": false}, {"data": [0.9, 500, 1500, "Remove item"], "isController": false}, {"data": [1.0, 500, 1500, "signup-135-1"], "isController": false}, {"data": [0.2647058823529412, 500, 1500, "signup-135-0"], "isController": false}, {"data": [1.0, 500, 1500, "fill checkout details"], "isController": false}, {"data": [1.0, 500, 1500, "checkout confirm"], "isController": false}, {"data": [1.0, 500, 1500, "select pet"], "isController": false}, {"data": [0.4, 500, 1500, "view_cart"], "isController": false}, {"data": [1.0, 500, 1500, "Debug Sampler"], "isController": false}, {"data": [1.0, 500, 1500, "select category"], "isController": false}, {"data": [0.3235294117647059, 500, 1500, "login-68"], "isController": false}, {"data": [0.7666666666666667, 500, 1500, "add to cart pet"], "isController": false}, {"data": [0.9, 500, 1500, "JSR223 Sampler"], "isController": false}, {"data": [0.9, 500, 1500, "view_cart-0"], "isController": false}, {"data": [1.0, 500, 1500, "login-68-1"], "isController": false}, {"data": [0.8, 500, 1500, "checkout"], "isController": false}, {"data": [0.38235294117647056, 500, 1500, "login-68-0"], "isController": false}, {"data": [0.9, 500, 1500, "view_cart-1"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 172, 0, 0.0, 867.639534883721, 3, 8302, 325.0, 2276.6000000000004, 2703.0999999999995, 5575.450000000038, 4.692828137651836E-4, 0.001778927921877235, 4.4979242164869834E-4], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["signup-135", 17, 0, 0.0, 1487.0000000000002, 846, 2673, 1239.0, 2172.9999999999995, 2673.0, 2673.0, 4.63847089369064E-5, 2.607701013797841E-4, 9.894853896898087E-5], "isController": false}, {"data": ["Remove item", 5, 0, 0.0, 256.0, 168, 519, 201.0, 519.0, 519.0, 519.0, 1.3642324749379786E-5, 7.080952738569683E-5, 9.365775682435536E-6], "isController": false}, {"data": ["signup-135-1", 17, 0, 0.0, 238.05882352941177, 173, 408, 204.0, 351.99999999999994, 408.0, 408.0, 4.638491637172022E-5, 2.4496234586404844E-4, 3.218806237191982E-5], "isController": false}, {"data": ["signup-135-0", 17, 0, 0.0, 1246.4705882352941, 648, 2264, 1022.0, 1845.5999999999997, 2264.0, 2264.0, 4.638473488197684E-5, 1.5808859837704995E-5, 6.676065788533603E-5], "isController": false}, {"data": ["fill checkout details", 5, 0, 0.0, 225.6, 168, 336, 221.0, 336.0, 336.0, 336.0, 1.3642249225132521E-5, 6.309540266623791E-5, 1.6932908950335385E-5], "isController": false}, {"data": ["checkout confirm", 5, 0, 0.0, 244.4, 167, 448, 203.0, 448.0, 448.0, 448.0, 1.3642213082479083E-5, 7.617790469298378E-5, 8.699575334823087E-6], "isController": false}, {"data": ["select pet", 5, 0, 0.0, 218.2, 167, 277, 218.0, 277.0, 277.0, 277.0, 1.3642473306413679E-5, 6.612069826145614E-5, 9.245973119776458E-6], "isController": false}, {"data": ["view_cart", 5, 0, 0.0, 932.6, 513, 2317, 612.0, 2317.0, 2317.0, 2317.0, 1.3642160822997512E-5, 6.513332447620589E-5, 6.341473195065249E-6], "isController": false}, {"data": ["Debug Sampler", 5, 0, 0.0, 4.4, 3, 6, 4.0, 6.0, 6.0, 6.0, 1.3642594767500103E-5, 5.076004498454628E-6, 0.0], "isController": false}, {"data": ["select category", 5, 0, 0.0, 217.8, 202, 239, 218.0, 239.0, 239.0, 239.0, 1.364251149774498E-5, 5.87267487129491E-5, 8.819670519049978E-6], "isController": false}, {"data": ["login-68", 17, 0, 0.0, 1718.0588235294117, 314, 3479, 1704.0, 3403.0, 3479.0, 3479.0, 4.6384643125150596E-5, 2.500795206725577E-4, 7.464495591153314E-5], "isController": false}, {"data": ["add to cart pet", 15, 0, 0.0, 1196.8, 160, 8302, 216.0, 6061.000000000002, 8302.0, 8302.0, 4.092703477218445E-5, 2.1234896068810153E-4, 2.785756175411383E-5], "isController": false}, {"data": ["JSR223 Sampler", 5, 0, 0.0, 402.2, 39, 1446, 188.0, 1446.0, 1446.0, 1446.0, 1.3642579096181099E-5, 0.0, 0.0], "isController": false}, {"data": ["view_cart-0", 5, 0, 0.0, 605.0, 348, 1452, 405.0, 1452.0, 1452.0, 1452.0, 1.364216849067416E-5, 5.995093575003293E-6, 3.1707383796684085E-6], "isController": false}, {"data": ["login-68-1", 17, 0, 0.0, 227.2941176470588, 158, 406, 197.0, 351.59999999999997, 406.0, 406.0, 4.6384670335757756E-5, 2.358562430744447E-4, 3.257158836077107E-5], "isController": false}, {"data": ["checkout", 5, 0, 0.0, 1047.0, 164, 4471, 205.0, 4471.0, 4471.0, 4471.0, 1.3642286559094054E-5, 7.467286734738493E-5, 9.019363281744799E-6], "isController": false}, {"data": ["login-68-0", 17, 0, 0.0, 1487.8823529411764, 155, 3232, 1514.0, 3183.2, 3232.0, 3232.0, 4.6384667045171006E-5, 1.4223423293148142E-5, 4.207340835496612E-5], "isController": false}, {"data": ["view_cart-1", 5, 0, 0.0, 327.0, 164, 864, 206.0, 864.0, 864.0, 864.0, 1.3642175935028667E-5, 5.913829978085182E-5, 3.170740109899241E-6], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": []}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 172, 0, "", "", "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
