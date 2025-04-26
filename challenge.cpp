// # Filtration Task for Problem Solving BootCamp
// # Write a Function that take 2 integergers (n,m) then print all prime numbers between them
// # Note: you can implement the task with any language you prefer like c++ only.
// # Input
// # The input consists of two integers n and m (1≤n≤1000000) and n always less than m
// # Output
// # Print all prime numbers

// # Examples
// # Input: 5 10
// # output : 7

// # Input: 7 20
// # Output: 11 13 17 19


int main() {
    int n, m;
    cin >> n >> m;

    // Function to check if a number is prime
    auto isPrime = [](int num) {
        if (num <= 1) return false;
        for (int i = 2; i * i <= num; ++i) {
            if (num % i == 0) return false;
        }
        return true;
    };

    // Loop through the range and print prime numbers
    for (int i = n + 1; i < m; ++i) {
        if (isPrime(i)) {
            cout << i << " ";
        }
    }

    return 0;
}