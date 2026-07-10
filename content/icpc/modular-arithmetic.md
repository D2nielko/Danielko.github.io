---
title: "Modular arithmetic cheat sheet"
date: "2026-06-14"
topics: ["math", "number-theory"]
description: "Fermat's little theorem, fast exponentiation, and the factorial-precompute nCr pattern."
---

Modular arithmetic shows up in almost every "count the number of ways"
problem, mostly because the true answer overflows any fixed-width integer
and problem setters ask for it mod some prime instead. These are the pieces
I keep forgetting and re-deriving, written down once.

## The basics

Working mod $p$, addition, subtraction, and multiplication all behave the
way you'd hope:

$$
(a + b) \bmod p = ((a \bmod p) + (b \bmod p)) \bmod p
$$

$$
(a \times b) \bmod p = ((a \bmod p) \times (b \bmod p)) \bmod p
$$

Division is the one that breaks — there's no direct "mod division." You
need the modular inverse instead.

## Fermat's little theorem

If $p$ is prime and $a$ is not divisible by $p$:

$$
a^{p-1} \equiv 1 \pmod p
$$

Multiply both sides by $a^{-1}$:

$$
a^{p-2} \equiv a^{-1} \pmod p
$$

So the modular inverse of $a$ is just $a^{p-2} \bmod p$, computable with
fast exponentiation. That's the whole trick — "division by $a$" becomes
"multiplication by $a^{p-2}$."

## Fast exponentiation (binpow)

Computing $a^{p-2}$ by multiplying $a$ by itself $p-2$ times is far too
slow. Binary exponentiation does it in $O(\log p)$ by squaring:

```cpp
const long long MOD = 1e9 + 7;

long long binpow(long long a, long long e, long long mod = MOD) {
    a %= mod;
    long long result = 1;
    while (e > 0) {
        if (e & 1) result = result * a % mod;
        a = a * a % mod;
        e >>= 1;
    }
    return result;
}

long long inverse(long long a, long long mod = MOD) {
    return binpow(a, mod - 2, mod);
}
```

`MOD = 1e9 + 7` is the standard competitive programming convention — it's
prime, and it's just under $2^{31}$, small enough that products of two
values fit comfortably in a 64-bit `long long` without overflow.

## nCr with factorial precompute

Combinatorics problems usually want $\binom{n}{r} \bmod p$ for many
queries, so precomputing factorials and inverse factorials up front makes
each query $O(1)$ after an $O(n \log p)$ setup:

```cpp
vector<long long> fact, inv_fact;

void precompute(int n) {
    fact.assign(n + 1, 1);
    for (int i = 1; i <= n; i++) fact[i] = fact[i - 1] * i % MOD;

    inv_fact.assign(n + 1, 1);
    inv_fact[n] = inverse(fact[n]);
    for (int i = n; i > 0; i--) inv_fact[i - 1] = inv_fact[i] * i % MOD;
}

long long nCr(int n, int r) {
    if (r < 0 || r > n) return 0;
    return fact[n] * inv_fact[r] % MOD * inv_fact[n - r] % MOD;
}
```

The downward loop for `inv_fact` is the neat part: instead of calling
`inverse()` on every factorial (each an $O(\log p)$ call), you compute it
once at the top and divide it down, since $\text{inv\_fact}[i-1] =
\text{inv\_fact}[i] \times i$.

One thing worth remembering: this whole approach depends on $p$ being
prime. If a problem uses a composite modulus, Fermat's little theorem
doesn't apply and you need the extended Euclidean algorithm instead.
