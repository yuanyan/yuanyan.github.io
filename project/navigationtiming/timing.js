var d = window.document;

var tc = d.getElementById("timingChart");



function initMeasures() {

    var p = window.performance.timing;
    var m = window.performance.timingMeasures;

    if ((typeof p.domContentLoadedEventStart != 'undefined') || (typeof window.webkitPerformance != 'undefined')) {
        m.navigation = (p.loadEventEnd - p.navigationStart);
        m.unloadEvent = (p.unloadEventEnd - p.unloadEventStart);
        m.redirect = (p.redirectEnd - p.redirectStart);
        m.domainLookup = (p.domainLookupEnd - p.domainLookupStart);
        m.connect = (p.connectEnd - p.connectStart);
        m.request = (p.responseStart - p.requestStart);
        m.response = (p.responseEnd - p.responseStart);
        m.domLoading = (p.domInteractive - p.domLoading);
        m.domInteractive = (p.domContentLoadedEventEnd - p.domInteractive);
        m.domContentLoaded = (p.domContentLoadedEventEnd - p.domContentLoadedEventStart);
        m.domComplete = (p.domComplete - p.domLoading);
        m.loadEvent = (p.loadEventEnd - p.loadEventStart);
        m.fetch = (p.responseEnd - p.fetchStart);
        m.firstPaint = (p.firstPaint - p.navigationStart);
    }
}

if (window.performance != null) {
    if (typeof Performance != 'undefined'){
        if (Performance.prototype == Object.getPrototypeOf(window.performance)) {
            //supports web idl
            Performance.prototype.timingMeasures = {
                navigation: 0,
                unloadEvent: 0,
                redirect: 0,
                domainLookup: 0,
                connect: 0,
                request: 0,
                response: 0,
                domLoading: 0,
                domInteractive: 0,
                domContentLoaded: 0,
                domComplete: 0,
                loadEvent: 0,
                fetch: 0,
                firstPaint: 0
            };
        }
    } else if (window.performance.__proto__ == Object.getPrototypeOf(window.erformance)) {
        window.performance.__proto__.timingMeasures = {
            navigation: 0,
            unloadEvent: 0,
            redirect: 0,
            domainLookup: 0,
            connect: 0,
            request: 0,
            response: 0,
            domLoading: 0,
            domInteractive: 0,
            domContentLoaded: 0,
            domComplete: 0,
            loadEvent: 0,
            fetch: 0,
            firstPaint: 0
        };
    }
}

if (window.webkitPerformance != null) {
    window.__proto__.performance = window.webkitPerformance;
    window.performance.__proto__.timingMeasures = {
        navigation: 0,
        unloadEvent: 0,
        redirect: 0,
        domainLookup: 0,
        connect: 0,
        request: 0,
        response: 0,
        domLoading: 0,
        domInteractive: 0,
        domContentLoaded: 0,
        domComplete: 0,
        loadEvent: 0,
        fetch: 0,
        firstPaint: 0
    };
}

if (window.msPerformance != null) {
    Window.prototype.performance = window.msPerformance;
    if (window.msPerformance.timingMeasures == null) {
        MSPerformance.prototype.timingMeasures = {
            navigation: 0,
            unloadEvent: 0,
            redirect: 0,
            domainLookup: 0,
            connect: 0,
            request: 0,
            response: 0,
            domLoading: 0,
            domInteractive: 0,
            domContentLoaded: 0,
            domComplete: 0,
            loadEvent: 0,
            fetch: 0,
            firstPaint: 0
        };
    }
}

if (window.performance != null) {

    var cMsPerfTimingMarksPrefix = "window.performance.timing.";
    var cMsPerfTimingMeasurePrefix = "window.performance.timingMeasures.";
    var cMsPerfNavPrefix = "window.performance.navigation.";
    var timingMarks = new Array();
    var timingMeasures = [
        "navigation",
        "unloadEvent",
        "redirect",
        "domainLookup",
        "connect",
        "request",
        "response",
        "domLoading",
        "domInteractive",
        "domContentLoaded",
        "domComplete",
        "loadEvent",
        "fetch"
        //"firstPaint"
        ];
    if (typeof window.performance.timing.domContentLoadedEventStart != 'undefined') {
        timingMarks = [
        "navigationStart",
        "fetchStart",
        "unloadEventStart",
        "unloadEventEnd",
        "redirectStart",
        "redirectEnd",
        "domainLookupStart",
        "domainLookupEnd",
        "connectStart",
        "connectEnd",
        "requestStart",
        "responseStart",
        "responseEnd",
        "domLoading",
        "domInteractive",
        "domContentLoadedEventStart",
        "domContentLoadedEventEnd",
        "domComplete",
        "loadEventStart",
        "loadEventEnd"
        ];
    }
    else {
         timingMarks = [
        "navigationStart",
        "fetchStart",
        "unloadEventStart",
        "unloadEventEnd",
        "redirectStart",
        "redirectEnd",
        "domainLookupStart",
        "domainLookupEnd",
        "connectStart",
        "connectEnd",
        "requestStart",
        "responseStart",
        "responseEnd",
        "domLoading",
        "domInteractive",
        "domContentLoaded",
        "domComplete",
        "loadEventStart",
        "loadEventEnd"
        ];
        }
    
    var navigation = [
        "type",
        "redirectCount",
        ];
    var navType = ["navigate", "reload", "Back/Foward"];
    var startTimingMapping = new Array();
    if (typeof window.performance.timing.domContentLoadedEventStart != 'undefined') {
        startTimeMapping = new Array(0, 2, 4, 6, 8, 10, 11, 13, 14, 16, 13, 17, 1);
    }
    else {
        startTimeMapping = new Array(0, 2, 4, 6, 8, 10, 11, 13, 14, 13, 13, 17, 1);
    }
    var navigationStart = eval(cMsPerfTimingMarksPrefix + timingMarks[0]);

    var measureDescriptions = [         
        { name: "Navigation", description: "The time taken from when the user initiates a navigation action to when the onload event completes." } ,
        { name: "onUnload", description: "The time taken to execute the unload event handler of the previous navigation." },
        { name: "Redirect", description: "The time taken to redirect to the current navigation." },
        { name: "Domain name lookup", description: "The time taken to resolve the DNS of the root document." },
        { name: "Connect", description: "The time taken to make the first TCP connection." },
        { name: "Request", description: "The time taken to make the request for the root document." },
        { name: "Response", description: "The time taken to receieve the response body of the root document." },
        { name: "DOM loading", description: "The time taken from when the onreadystate change transitions from domLoading to domInteractive." },
        { name: "DOM interactive", description: "The time taken from when the onreadystate change transitions from domInteractive to domContentLoaded." },
        { name: "DomContentLoaded", description: "The time taken to execute the domContentloaded handler." },        
        { name: "DOM complete", description: "The time taken from when the onreadystate change transitions from domLoading to domComplete." },
        { name: "onLoad", description: "The time taken to begin and complete the onload event for the root document" },
        { name: "Fetch", description: "The time taken from fetchStart to loadEnd, this is the time taken to fetch and load the root document."},
        { name: "First Paint", description: "The time taken from when the user initiates navigation to when website content was first painted to the screen." } 
    ];
    var timingDescriptions = new Array();
    if(typeof window.performance.timing.domContentLoadedEventStart != 'undefined')
    {
        timingDescriptions = [
            { name: "Navigation Start", description: "The UTC time (ms) the user initiates navigation." },
            { name: "Fetch Start", description: "The UTC time (ms) the browser began fetching the root document." },
            { name: "onunload event start", description: "The UTC time (ms) when the onunload event fired." },
            { name: "onunload event end", description: "The UTC time (ms) when the onunload event completed." },
            { name: "Redirect start", description: "The UTC time (ms) of the first http redirection." },
            { name: "Redirect end", description: "The UTC time (ms) of the last http redirection." },
            { name: "Domain name lookup start", description: "The UTC time (ms) the first DNS lookup was initiated for the root document." },
            { name: "Domain name lookup end", description: "The UTC time (ms) the first DNS lookup completed for the root document." },
            { name: "TCP connection start", description: "The UTC time (ms) the first TCP connection was initiated for the root document." },
            { name: "TCP connection end", description: "The UTC time (ms) the first TCP connection completed for the root document." },
            { name: "Request start", description: "The UTC time (ms) the request was initiated for the root document." },
            { name: "Response start", description: "The UTC time (ms) the response body was initiated for the root document." },
            { name: "Response end", description: "The UTC time (ms) the response body completed for the root document." },
            { name: "DOM loading", description: "The UTC time (ms) the onreadystate change transitioned to domLoading." },
            { name: "DOM interactive", description: "The UTC time (ms) the onreadystate change transitioned to domInteractive." },
            { name: "DomContentLoadedEventStart", description: "The UTC time (ms) the onreadystate change transitioned to domContentLoaded." },
            { name: "DomContentLoadedEventEnd", description: "The UTC time (ms) domContentLoaded event completed." },
            { name: "DOM complete", description: "The UTC time (ms) the onreadystatechange transitioned to domComplete." },
            { name: "onload event start", description: "The UTC time (ms) the onload event fired." },
            { name: "onload event end", description: "The UTC time (ms) the onload event completed." }
        ];
    }
    else {
        timingDescriptions = [
            { name: "Navigation Start", description: "The UTC time (ms) the user initiates navigation." },
            { name: "Fetch Start", description: "The UTC time (ms) the browser began fetching the root document." },
            { name: "onunload event start", description: "The UTC time (ms) when the onunload event fired." },
            { name: "onunload event end", description: "The UTC time (ms) when the onunload event completed." },
            { name: "Redirect start", description: "The UTC time (ms) of the first http redirection." },
            { name: "Redirect end", description: "The UTC time (ms) of the last http redirection." },
            { name: "Domain name lookup start", description: "The UTC time (ms) the first DNS lookup was initiated for the root document." },
            { name: "Domain name lookup end", description: "The UTC time (ms) the first DNS lookup completed for the root document." },
            { name: "TCP connection start", description: "The UTC time (ms) the first TCP connection was initiated for the root document." },
            { name: "TCP connection end", description: "The UTC time (ms) the first TCP connection completed for the root document." },
            { name: "Request start", description: "The UTC time (ms) the request was initiated for the root document." },
            { name: "Response start", description: "The UTC time (ms) the response body was initiated for the root document." },
            { name: "Response end", description: "The UTC time (ms) the response body completed for the root document." },
            { name: "DOM loading", description: "The UTC time (ms) the onreadystate change transitioned to domLoading." },
            { name: "DOM interactive", description: "The UTC time (ms) the onreadystate change transitioned to domInteractive." },
            { name: "DomContentLoaded", description: "The UTC time (ms) the onreadystate change transitioned to domContentLoaded." },
            { name: "DOM complete", description: "The UTC time (ms) the onreadystatechange transitioned to domComplete." },
            { name: "onload event start", description: "The UTC time (ms) the onload event fired." },
            { name: "onload event end", description: "The UTC time (ms) the onload event completed." }
        ];
    }

    var navDescriptions = [
        { name: "Type", description: "The type of navigation that occurred: navigate, reload, back/foward." },
        { name: "Redirected count", description: "The number of redirections encountered to load the root document." }
    ];
    
    var dbg = d.getElementById("debug");

    var animateBar = new Array();
    var animateBarId = null;
}

function msPerf() {
    if (window.performance == null) {
        tc.innerHTML = ("The window.msPerformance object is not supported in this browser. Please try the latest IE9 Platform Preview.");
        return;
    }

    var ct = d.getElementById("timingChartDiv");

    if (ct != null) {
        return;
    }

    initMeasures();

    var MaxTime = findMaxTimestamp();
    var StartTime = eval(cMsPerfTimingMarksPrefix + timingMarks[0]);
    var Range = MaxTime - StartTime;

    var results = new Array();

    for (var i = 0; i < timingMeasures.length; i++) {
        var measureName = timingMeasures[i];
        var timeTaken = eval(cMsPerfTimingMeasurePrefix + timingMeasures[i]);
        var result = {};
        if (!isNaN(timeTaken)) {
            var startPhase = getStartTime(i, navigationStart);
            startPhase = (startPhase < 0) ? 0 : startPhase;
            result = { name: measureName, elapsed: timeTaken, startTime: startPhase };
        } else {
            result = { name: measureName, elapsed: 'n/a', startTime: 0 };
        }

        results.push(result);
    }

    showTimingChart("Time Phases", results, 500, Range);

    showDataTable();
}

function findMaxTimestamp() {
    var oldResults = 0;
    for (var i = 0; i < timingMarks.length; i++) {
        var results = eval(cMsPerfTimingMarksPrefix + timingMarks[i]);
        if (results > oldResults) {
            oldResults = results;
        }
    }
    return oldResults;
}

function getStartTime(m, start) {
    var time = (eval(cMsPerfTimingMarksPrefix + timingMarks[startTimeMapping[m]]) - start);
    return time;
}

function showTimingChart(headerName, data, maxBarLength, maxTime){
    var scaleBar = 1;

    if (maxTime < 100) {
        interval = 25;
        scaleBar = 4;
    }
    else if (maxTime >= 100 && maxTime <= 700) {
        interval = 100;
        scaleBar = 1;
    }
    else if (maxTime > 700 && maxTime < 3000) {
        interval = 500;
        scaleBar = 0.2;
    }
    else {
        interval = 1000;
        scaleBar = 0.1;
    }
    
    var maxNumIntervals = Math.round(maxTime / interval)+2;
    var maxAllowedTime = maxNumIntervals * interval;
    
    var ct = d.createElement("div");
    ct.className = "outercontainer";
    ct.id = "timingChartDiv";
    var row = d.createElement("div");
    row.className = "hrow";
    
    var headers = createLeftColumn(headerName);
    row.appendChild(headers);
    headers = createTimeHeaders(maxNumIntervals, maxBarLength, interval);
    row.appendChild(headers);
    
    ct.appendChild(row);

    for(var i = 0; i < data.length; i++)
    {
        var row = addRow(data[i], i, scaleBar);
        ct.appendChild(row);
    }

    tc.appendChild(ct);

    animateBarId = setInterval(animateBars, 1000.0 / 60.0);

}

function addRow(data,id, scaleBar)
{
    var row = d.createElement("div");
    row.className = "row";
    row.id = "r_timingMeasures_" + id;
    
    row.setAttribute("onmouseover", "descripHandler(this);");
    row.setAttribute("onmouseout", "closeDescrip();");

    

    var rowhead = d.createElement("div");
    rowhead.className = "rowheading";
    rowhead.innerHTML = data.name;
    rowhead.id = "rh_timingMeasures_" + id;
    rowhead.setAttribute("onactivate", "descripHandler(this)");
    rowhead.setAttribute("ondeactivate", "closeDescrip()");
    rowhead.tabIndex = 0;
    row.appendChild(rowhead);

    var barwrapper = d.createElement("div");
    barwrapper.className = "barwrapper";

    var bar = d.createElement("div");
    var barid = "bar_" + data.name;
    bar.id = barid;
    bar.className = "bar";

    var width = 0;
    if (!isNaN(data.elapsed)) {
        width = data.elapsed * scaleBar;
    }
    var left = data.startTime * scaleBar;
    bar.style.left = left + "px";

    bar.style.width = 0;
    var animate = { id: barid, barWidth: 0, maxWidth: width };
    animateBar.push(animate);

    if (!isNaN(data.elapsed)) {
        bar.innerHTML = data.elapsed + "ms";
    } else {
        
        bar.innerHTML = data.elapsed;
    }
    barwrapper.appendChild(bar);
    row.appendChild(barwrapper);
    return row;
}


function createLeftColumn(headerName)
{
    var h = d.createElement("div");
    h.className = "leftcontainer";
    var ht = d.createTextNode(headerName);
    h.appendChild(ht);
    return h;
}

function createTimeHeaders(maxNumIntervals, maxBarLength, interval)
{
    var h = d.createElement("div");
    h.className="container";
    h.style.width=maxBarLength;
    var row = d.createElement("row");
    row.className = "row";

    var width = maxBarLength / maxNumIntervals;
    
    for (var i = 0; i < maxNumIntervals; i++)
    {
        var tdiv = d.createElement("div");
        tdiv.className = "timediv";
        tdiv.style.width = width;
        var timeInterval = (i*interval);
        tdiv.innerHTML = timeInterval + "ms";
        row.appendChild(tdiv);
    }

    h.appendChild(row);
    return h;
}

function animateBars() {
    var done = true;

    for (var i = 0; i < animateBar.length; i++) {
        var elem = d.getElementById(animateBar[i].id);

        if (animateBar[i].barWidth < animateBar[i].maxWidth) {
            done = false;
        }

        if (animateBar[i].barWidth < animateBar[i].maxWidth) {
            animateBar[i].barWidth += 10;
            elem.style.width = animateBar[i].barWidth + "px";            
        }
        else {
            var width = (animateBar[i].maxWidth) ? animateBar[i].maxWidth : 1;
            elem.style.width = width + "px";
        }
    }

    if (done) {
        clearInterval(animateBarId);
    }
}

function showDataTable() {
    var grids = createGrid(2);

    var t0 = "";
    var t1 = "";
    if (window.msPerformance != null) {
        t0 = "window.msPerformance.navigation";
        t1 = "window.msPerformance.timing";
    } else if (window.webkitPerformance != null) {
        t0 = "window.webkitPerformance.navigation";
        t1 = "window.webkitPerformance.timing";
    } else if (window.performance != null) {
        t0 = "window.performance.navigation";
        t1 = "window.performance.timing";
    }
    
    setOutput(grids[0], t0, cMsPerfNavPrefix, navigation);    
    setOutput(grids[1], t1, cMsPerfTimingMarksPrefix, timingMarks);

}

function getUnits(title) {
    var units ="";

    switch (title) {
        case "window.webkitPerformance.timing":
        case "window.webkitPerformance.timingMeasures":
        case "window.msPerformance.timing":
        case "window.msPerformance.timingMeasures":
        case "window.performance.timing":
        case "window.performance.timingMeasures":
            units = " ms";
            break;
        default:
            break;
    }

    return units;
}

function setTitle(grid, title) {
    var span = d.createElement("span");
    span.className = "gridtitle";
    var titletext = d.createTextNode(title);
    span.appendChild(titletext);
    grid.appendChild(span);
}

function setOutput(grid, title, prefix, dataArray) {
    var identifier = title.split(".");
    var prefixid = identifier[2];
    
    setTitle(grid, title);

    for (var i = 0; i < dataArray.length; i++) {
        var row = d.createElement("div");
        row.className = "gridcontentrow";
        
        var result = eval(prefix + dataArray[i]);
        result = (result == null) ? 'n/a' : result + getUnits(title);

        if ( (title == "window.msPerformance.navigation") ||
             (title == "window.webkitPerformance.navigation") ||
             (title == "window.performance.navigation") ){
            if (i == 0) { result = navType[result]; }
        }

        
        var col1 = d.createElement("div");
        col1.className = "gridcontent";
        var tn1 = d.createTextNode(dataArray[i]);
        col1.appendChild(tn1);
        col1.tabIndex = 0;
        col1.setAttribute("onactivate", "descripHandler(this)");
        col1.setAttribute("ondeactiavte", "closeDescrip();");
        col1.id = "ch_" + prefixid + "_" + i;
        row.setAttribute("onmouseover", "descripHandler(this)");
        row.setAttribute("onmouseout", "closeDescrip();");

        row.id = "c_" + prefixid + "_" + i;
        row.appendChild(col1);

        var col2 = d.createElement("div");
        col2.className = "gridcontent";
        
        var tn2 = d.createTextNode(result);
        col2.appendChild(tn2);
        row.appendChild(col2);

        grid.appendChild(row);
        
    }
}

function createGrid(numGrids) {
    var grids = new Array();
    var g = d.createElement("div");
    g.className = "outercontainer";
    g.id = "gridcontainer";

    for (var i = 0; i < numGrids; i++) {
        var gg = d.createElement("div");
        gg.className = "gridcell";
        gg.id = "grid_" + i;
        grids.push(gg);
        g.appendChild(gg);
    }

    var spacer = d.createElement("div");
    spacer.className = "spacer";

    tc.appendChild(spacer);

    tc.appendChild(g);

    return grids;
}

function descripHandler(event) {
    var id = event.id;
    var info = id.split("_");
    var result = "";
    var title = ""
    var index = parseInt(info[2], 10);
    var prefix = info[1];

    if (info[1].indexOf("nce")>-1) {
        prefix = info[1].substring(4);
    }
    switch (prefix) {
        case "timing":            
            title = timingDescriptions[index].name;
            result = timingDescriptions[index].description;
            break;
        case "timingMeasures":
            title = measureDescriptions[index].name;
            result = measureDescriptions[index].description;
            break;
        case "navigation":
            title = navDescriptions[index].name;
            result = navDescriptions[index].description;
            break;
    }

    displayToolTip(title, result, id);
}

function displayToolTip(title, result, id) {
    var tt = d.getElementById("dispTooltip");
    tt.style.display = "block";

    if (window.event.type == "mouseover") {
        tt.style.top = (window.event.clientY - 82) + "px";
        tt.style.left = window.event.clientX + "px";
    }
    else {
        var rect = d.getElementById(id).getBoundingClientRect();
        tt.style.top = (rect.top - 65) + "px";
        tt.style.left = (rect.right + 2) + "px";
    }

    var spantitle = d.getElementById("tooltip_title");
    spantitle.innerHTML = title + "</br>";

    var spancont = d.getElementById("tooltip_content");
    spancont.innerHTML = result;    
}

function closeDescrip() {
    var tt = d.getElementById("dispTooltip");
    tt.style.display = "none";
}

if (loaded > 0) {
    window.addEventListener("load", function () { window.setTimeout(msPerf, 100); }, false);
}