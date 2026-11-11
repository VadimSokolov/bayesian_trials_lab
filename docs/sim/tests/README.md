# Tests for the Core engine (Phase A)

Run everything in Node (no dependencies): `node testing/sim/tests/run.js` (optionally `node testing/sim/tests/run.js engine` to run one file). Exit code is 1 when a test fails.

| File | What it checks |
|---|---|
| `math.test.js` | normal and beta cdfs and quantiles, log-gamma, logsumexp, sampler means and variances, seeded streams, integrators, Cholesky, Laplace, Metropolis |
| `models.test.js` | beta-binomial and normal-normal posteriors exact; NDLM tau to 0 (pooled) and large (independent); hierarchical shrinkage direction; monotone, second-order, linear; logit approximation; Metropolis curves with warm start |
| `engine.test.js` | type I error and power against closed form (20,000 trials), group sequential OBF type I error, seven outcome counts, outcome logic, common random numbers, reEvaluate, accrual, triggers, QOI ranges, adaptive allocation and arm dropping, every model type |
| `fixtures.test.js` | R fixtures: gsDesign and rpact boundaries (all four spending types, K = 2 to 5), simulated power at the nBinomial and nNormal sample sizes, beta-binomial posterior, quantiles, thresholds and exact predictive probability |
| `borrowing.test.js` | RBesT fixture (robust mixture prior, moment and ELIR ESS, posterior with exact weight update, oc2S and oc1S exact enumeration, simulated oc2S); type I error under prior-data conflict (rises with power prior a0, falls with robust weight); borrowing diagnostics; hierarchical tau to 0 (pooled) and tau large (no borrowing), dichotomous and continuous; normal mixtures against brute-force integration |
| `doseresponse.test.js` | DoseFinding fixture: ML Emax and sigmoid Emax by profile least squares reproduce fitMod; engine posterior means (logistic3 = Emax, sigmoid) against the ML fits |
| `perf.test.js` | 1,000 trials of (a) two-arm dichotomous with 4 interims and (b) 5 doses plus control, NDLM, adaptive allocation, 6 interims |
| `worker.test.js` | worker logic (chunked equals one-shot, progress, cancel, reEvaluate) |
| `escalation.test.js` | dose escalation (`escalation.js`): 3+3 exact escalation probability and R `escalation` operating characteristics; BOIN boundaries exact and `BOIN::get.oc` operating characteristics; `dfcrm` CRM posterior (exact) and `crmsim` operating characteristics; mTPI, mTPI-2 (against an independent keyboard computation), i3+3 tables; BLRM/N-CRM (fixed-alpha posterior against brute force, grid refinement, overdose control at decision time, bands, run-in, step cap); backfill, expansion, stopping; timing |

## TODO (not done in Phase A)

- Fixtures present but not yet compared: the MCP-Mod power entry of `dose-response.json` (needs a MCP-Mod test, not an engine feature); `boin.json`, `crm.json`, `simon.json`, `three-plus-three.json` belong to Phase C engines. Done in Phase A: `borrowing.json` (all five entries, Morita ESS excluded) and the Emax and sigmoid Emax fits of `dose-response.json`.
- Dose-response comparison notes: the fixture holds ML (least squares) estimates; the engine gives posterior means. Emax (engine type `logistic3`) agrees to 0.003; sigmoid Emax differs by up to 0.06 because the engine's log-normal(0, 0.5) prior on the Hill exponent pulls it from the ML value 1.95 toward 1 (3 observations per dose barely identify it). The alias `emax` in models.js maps to the sigmoid model with free Hill exponent, not to the 3-parameter Emax.
- Borrowing not done: Morita ESS; hierarchical prior combined with a robust component; tau posterior updated by the current control data (the control posterior is exact given the historical data, but current control data do not feed back into mu and tau, which is the standard MAP approach); borrowing for curve models (logistic3, sigmoid, hierLogistic, linear) where the control is tied to the dose arms; borrowing for the active comparator; time-to-event hazards.
- Compare the engine's adaptive designs with `adaptr` operating characteristics (no fixture yet).
- Models not in Phase A: U-shaped, 3-parameter exponential logistic, 2D models, baseline-adjusted models.
- Longitudinal models, time-to-event and ordinal endpoints, sample size re-estimation (Phase B). The visit schedule uses only the final visit.
- Decision quantities not yet implemented: trend p-value, Fisher exact p-value, non-inferiority conditional power for the future trial, operational QOIs (dropout rate, trial status flags). Predictive probability of a future trial uses the current-trial formulation.
- Test of the 5 and 6 outcome codes with a deterministic construction (currently exercised through a design that makes flip-flops possible, with only counts and consistency checked).
- Test the browser path (core files loaded as script tags and the Web Worker in a real browser); the worker logic is tested in Node only.
- Dunnett adjustment is exact for z statistics only; compare with `multcomp` or `mvtnorm` output when a fixture is generated.
