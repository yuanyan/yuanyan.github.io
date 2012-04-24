function fibonacci2(n) {

    if(n == 0 || n==1) {
        return n;
    }
    else {
        return(fibonacci2(n - 1) + fibonacci2(n - 2));
    }
}

self.onmessage = function(event) {
    var n = parseInt(event.data);
    var res = fibonacci2(n);
    self.postMessage(res);
};
