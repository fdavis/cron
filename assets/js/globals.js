// swap function for arrays
var arraySwap = function(arr, index1, index2) {
    if(arr.constructor === Array
       && index1 >= 0
       && index1 <= arr.length
       && index2 >= 0
       && index2 <= arr.length
       && index1 != index2){

        var tmp = arr[index1];
        arr[index1] = arr[index2];
        arr[index2] = tmp;

    } else {
        console.log('failure to swap arrays:' + arr + ' i1:' + index1 + ' i2:' + index2);
    }
};
