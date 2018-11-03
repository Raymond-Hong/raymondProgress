//1.
const aplusb = function (a, b) {
    if (!a || !b) {
        return a || b;
    } else {
        return aplusb(a ^ b, (a & b) << 1);
    }
}
//2.
const trailingZeros = function(n){
    var res = 0;
    while (n>5){
        n=parseInt(n/5);
        res += n;
    } 
    return res;
}
//3.
const digitCounts = function (k, n) {
    var str = '', i = 0;
    while (i <= n) {
        if (~(i++ + '').indexOf(k)) {
            str += i - 1;
        }
    }
    var reg = new RegExp('' + k, 'g');
    return str.match(reg).length;
}

//4.
const nthUglyNumber = function (n) {
    let arr = [1], i2 = i3 = i5 = 0, mn, nex2, nex3, nex5;
    for (let i = 1; i < n; i++){
        nex2 = arr[i2] * 2;
        nex3 = arr[i3] * 3;
        nex5 = arr[i5] * 5;
        mn = Math.min(nex2, nex3, nex5);
        if (mn == nex2) i2++;
        if (mn == nex3) i3++;
        if (mn == nex5) i5++;
        arr.push(mn);
    }
    return arr[n - 1];
}
//5.
const kthLargestElement = function(n,nums){
    nums.sort(function(a,b){return b-a;});
    return nums[n-1];
}
//6.
const mergeSortedArray = function(A,B){
    let merged = A.concat(B);
    merged.sort(function(a,b){return a-b});
    return merged;
}
//9.
const fizzBuzz = function (n) {
    let res = []
    const obj = {0:'fizz buzz',3:'fizz',6:'fizz',9:'fizz',12:'fizz',5:'buzz',10:'buzz'}
    for(let i=1;i<=n;i++){
        res.push(obj[i%15]||(''+i))
    }
    return res
}
//11.
const searchRange = function (root, k1, k2) {
    // if(!root || typeof root.val == 'object'){
    //     return [];
    // }
    // return getR(root,k1,k2).sort(function(a,b){a-b});
    // function getR(root,k1,k2){
    //     var r = [];
    //     if(root.val>=k1&&root.val<=k2){
    //         r.push(root.val);
    //     }
    //     if(root.left){
    //         r = r.concat(getR(root.left,k1,k2));
    //     }
    //     if(root.right){
    //         r = r.concat(getR(root.right,k1,k2));
    //     }
    //     return r;
    // }
}
//14.
const binarySearch = function (nums, target) {
    var temp, min = 0,
        mid, max = nums.length - 1;
    while (mid !== ~~((max + min) / 2)) {
        mid = ~~((max + min) / 2);
        temp = nums[mid];
        console.log(temp, mid);
        if (temp > target) {
            max = mid;
        } else if (temp < target) {
            min = mid;
        } else {
            while (typeof nums[mid - 1] !== 'undefined' && nums[mid - 1] == target) {
                mid--;
            }
            return mid;
        }
    }
    return -1;
}

//17.
const subsets = function (nums){
    // var resArr = [[]];
    // nums.sort(function (a,b){
    //     return a-b;
    // });
    // while(nums.length){
    //     var ele = nums.shift();
    //     resArr = resArr.concat(resArr.map(map));
    // }
    // return resArr;
    // function map(item){
    //     return item.concat(ele);
    // }
}
//31.
let partitionArray=(nums, k)=>{return nums.filter((e)=>{return e<k;}).length;}
//37.
const reverseInteger = function (number) {
    return ~~('' + number).split('').reverse().join('');
}
//56.
const twoSum = function (numbers, target) {
    Object.defineProperty(numbers, Symbol.iterator, {
        enumerable: false,
        writable: false,
        configurable: true,
        value: function () {
            var o = this;
            var ks = Object.keys(o);
            var ids = ks.length-1;
            return {
                next: function (val) {
                    while (target != val + o[ks[ids]]) {
                        if (--ids < 0) {
                            break;
                        }
                    }
                    return {
                        value: ks[ids],
                        done: o[ks[ids]] + val == target
                    }
                }
            }
        }
    })
    var it, obj;
    for (var i = 0; i < numbers.length; i++) {
        it = numbers[Symbol.iterator]();
        obj = it.next(numbers[i]);
        if (obj.done) {
            return [i, ~~obj.value];
        }
    }
}