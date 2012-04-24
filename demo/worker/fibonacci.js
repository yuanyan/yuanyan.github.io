var results = [];

function resultReceiver(event) {
    results.push(parseInt(event.data));
    if (results.length == 2) {
        self.postMessage(results[0] + results[1]);
    }
}

function errorReceiver(event) {
    throw event.data;
}

self.onmessage = function(event) {
    var n = parseInt(event.data);

    if (n == 0 || n == 1) {
        self.postMessage(n);
        return;
    }

    for (var i = 1; i <= 2; i++) {
        var worker = new Worker("fibonacci.js");
        worker.onmessage = resultReceiver;
        worker.onerror = errorReceiver;
        worker.postMessage(n - i);
    }
}
