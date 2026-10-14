const factorial = (n) => {
    let multiple = 1
    for (let i = 2; i <= n; i++) {
        multiple = multiple * i
    }
    return multiple
}

// factorial(0)

const isPrime = (n) => {
    if (n < 2) {
        return false;
    }
    for (let i = 2; i <= Math.sqrt(n); i++) {
        if ((n % i) == 0) {
            return false
        }

    }
    return true
}

const isPowerOfTwo = (n) => {
    if (n < 1) {
        return false
    }
    for (let i = 0; i <= Math.sqrt(n); i++) {
        if ((2 ** i) == n) {
            return true
        }
    }
    return false
}

// console.log(isPrime(99))
console.log(isPowerOfTwo(1))

const bubbleSort = (arr) => {
    let n = arr.length;
    for (let i = 0; i < n; i++) {
        for (let j = i + 1; j < n; j++) {
            if (arr[i] > arr[j]) {
                const temp = arr[i];
                arr[i] = arr[j];
                arr[j] = temp;
            }
        }
    }
    return arr
}

console.log(bubbleSort([8, 20, -2, 4, -6]))

const insertionSort = (arr) => {
    
}