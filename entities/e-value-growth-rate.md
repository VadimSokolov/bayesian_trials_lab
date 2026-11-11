---
id: e-value-growth-rate
name: Growth rate of an e-value
type: concept
aliases: [growth rate]
level: 3
summary: The expected log-growth of wealth per observation under the alternative, which sets how fast a bet reaches the 1/alpha threshold.
chapters: ['12']
home: 12/how-big-a-bet-the-growth-rate
sections: [12/how-big-a-bet-the-growth-rate]
prerequisites: [e-value, test-martingale]
related:
- {rel: uses, to: wald-sprt}
- {rel: contrasts-with, to: power}
equations: []
functions: [ev_betting_paths]
results: []
lab: [08-e-values]
cites: [sokolova2026]
---
## What it is

A bet that is fair under the null can still be good or bad under the alternative. If the betting fraction $\lambda$ is small, wealth grows slowly. If it is large, wealth wobbles and can collapse. [12/how-big-a-bet-the-growth-rate]

For the binary design the expected log-growth per pair is

$$
g(\lambda) = \mathbb{P}(D = +1)\log(1+\lambda) + \mathbb{P}(D = -1)\log(1-\lambda),
$$

and the expected number of pairs to reach $1/\alpha$ is roughly $\log(1/\alpha)/g(\lambda)$, which is Wald's identity. [12/how-big-a-bet-the-growth-rate]

## Why it matters

The bet is chosen in advance from the effect one hopes to detect. An unrealistic choice costs power, not validity, and validity holds for every $\lambda$. [12/how-big-a-bet-the-growth-rate] This is the e-value analogue of choosing a design effect size. [12/how-big-a-bet-the-growth-rate]

## In the book

In the 45 versus 30 percent design the best fraction is $\lambda^\ast = 0.312$ with $g = 0.0238$ nats per pair, giving an expected crossing near 155 pairs. [12/how-big-a-bet-the-growth-rate] In simulations a fraction of 0.10 gives power 0.119, 0.31 gives 0.723 and 0.50 gives 0.589 at 200 pairs. [12/how-big-a-bet-the-growth-rate]

## Pitfalls

- A fraction that is too small or too large loses power, as the 0.10 and 0.50 results show. [12/how-big-a-bet-the-growth-rate]

## Check yourself

- Q: If you pick a poor betting fraction, what is damaged, validity or power? A: Power. Validity holds for every fraction. [12/how-big-a-bet-the-growth-rate]
- Q: Which of 0.10, 0.31 and 0.50 gave the highest power at 200 pairs? A: 0.31, with power 0.723. [12/how-big-a-bet-the-growth-rate]
