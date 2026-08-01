# STS report

## Overview

[NIST SP 800-22](https://csrc.nist.gov/pubs/sp/800/22/r1/upd1/final)
is a statistical test suite for (P)RNGs. It hosts several tests
aimed at validating RNGs, primarily through hypothesis testing.
You can read about the specifics of those tests in their own
paper and documentation.

While the SP 800-22 is not as rigorous as some other test suites
(such as the [diehard](https://en.wikipedia.org/wiki/Diehard_tests)
tests for example), it is a strong test to expose fundamental flaws
in RNGs by testing some basic statistics such as monobit frequency,
block frequency, (non)overlapping templates, etc. As such, my usage
of this test suite is mainly as a preliminary run aimed at exposing
fundamental flaws in the generator.

## Methodology

While NIST provides their own implementation of their test suite, it
has some limintations. For example it only supports single threading
which means tests on large data take a long time. Additionally,
there are some known bugs and areas of improvement, so several people
have made improved implementations of the test suite. I was made
aware of this myself when I encountered such bugs -- in particular,
when I tried running the test suite on bitstreams produced by
state-of-the-art CSPRNGs which are not known by any one to have any
defects that  differentiate their output from true random data (and
they have been subject to intense scrutiny by crytography experts no less), I found that some tests were still consistently failing. In particular I found this to be the case with the Overlapping Template test,
in which both my generator and CSPRNG output consistently gave low (< .05)
p-values (sometimes much lower).

As a result I chose to use this well-known [improved implementation](https://github.com/arcetri/sts) of the test suite. You can read their
README for some specifics on the improvements over their original that
they made. Unfortunately even this implementation has some defects it
seems, which I'll discuss below. Since the original implementation
gave results that indicated failure/non-randomness even on CSPRNG
output (and therefore giving evidence of some flawed tests), I carried
over the same suspicion to this improved version. Because of this I
ran the test suite both on data from my generator and also from CSPRNG
output, so that a baseline could be established, and the test results
for my generator could be compared to those of a generator that is known
to be a strong RNG. Therefore the results section will go over
results of the test suite on Goobits generated random data,
as well as provide a comparison against a known baseline.

## Results

### Goobits

Here is the overall summary that STS gives for a test consisting of
10,000 bitstreams, each of length 2^20 (a bit over a million, which is
STS's default value):

```
	185/188 tests passed successfully both the analyses.
 - The "Frequency" test passed both the analyses.
 - The "Block Frequency" test passed both the analyses.
 - The "Cumulative Sums" (forward) test passed both the analyses.
   The "Cumulative Sums" (backward) test passed both the analyses.
 - The "Runs" test passed both the analyses.
 - The "Longest Run of Ones" test passed both the analyses.
 - The "Binary Matrix Rank" test FAILED the uniformity analysis.
 - The "Discrete Fourier Transform" test FAILED both the analyses.
 - 147/148 of the "Non-overlapping Template Matching" tests passed both the analyses.
   1/148 of the "Non-overlapping Template Matching" tests FAILED the proportion analysis.
 - The "Overlapping Template Matching" test passed both the analyses.
 - The "Maurer's Universal Statistical" test passed both the analyses.
 - The "Approximate Entropy" test passed both the analyses.
 - 8/8 of the "Random Excursions" tests passed both the analyses.
 - 18/18 of the "Random Excursions Variant" tests passed both the analyses.
 - The "Serial" (first) test passed both the analyses.
   The "Serial" (second) test passed both the analyses.
 - The "Linear Complexity" test passed both the analyses.
```

However, this summary is not nearly as in depth as the individual
fail counts and p-values for each of the tests, which are shown here:

```
Test                              Success   Fail  Total   Fail %  p-value Flag
------------------------------------------------------------------------------
ApproximateEntropy                   9876    124  10000    1.24%   0.010893 
BlockFrequency                       9887    113  10000    1.13%   0.106060 
CumulativeSums                      19776    224  20000    1.12%   0.049412 
DFT                                  9867    133  10000    1.33%   0.000883 <-- UNUSUAL
Frequency                            9881    119  10000    1.19%   0.034189 
LinearComplexity                     9888    112  10000    1.12%   0.124870 
LongestRun                           9909     91  10000    0.91%   0.829873 
NonOverlappingTemplate            1464981  15019 1480000   1.01%   0.035766 
OverlappingTemplate                  9886    114  10000    1.14%   0.089435 
RandomExcursions                    49771    485  50256    0.97%   0.790216 
RandomExcursionsVariant            112055   1021 113076    0.90%   0.999590 
Rank                                 9898    102  10000    1.02%   0.433772 
Runs                                 9900    100  10000    1.00%   0.513499 
Serial                              19816    184  20000    0.92%   0.880473 
Universal                            9906     94  10000    0.94%   0.740165 
TOTAL                             1765297  18035 1783332   1.0113% 0.065202
```

This table lists each of the tests, and the success/fail/total count for each of them.
Here, each test is a test on 2^20 (or about one million) bits, and a failure
of a single test represents a p-value under the 0.01 threshold. Therefore the
expected fail-rate is exactly 1%, i.e. under the null hypothesis of random data
we expect to see 1% failure rates. The p-value column gives the p-value for
this binomial statistic, i.e., it gives the probability that we would see
at least as many failrues as we do under the null hypothesis of random data.
As you can see, all tests have fail-rates relatively close to the expected 1% failure
rate, and only one test has a p-value that is statistically significant regarding
this binomial statistic, which is for the DFT test.

In a vacuum, these results
are not particularly indicative of a defect in the generator, but they are slightly
concering. The p-value 0.000883 for DFT is quite low and is below the 0.001 threshold,
which is quite significant. Similarly, we see a trend towards low p-values for many
of the test, and the p-value for the total failure count across all runs
is 0.065202. This is not extremely low and certainly not below any reasonable
statistical significant threshold, but something that catches your eye nonetheless.
All in all, the overall results do not point towards anything alarming, *except*
for the low DFT p-value, and for the fact that six of the tests have p-values
less than 0.1, whereas we should only expect 1.5 tests to meet this treshold
on average for random data. Also, only 185/188 overall tests passed seems a bit low,
so depending on the methodology to compute those pass/fail rates, that could
be something worth investigating as well. So to get a better picture we will compare against
a baseline in the next section.

### CSPRNG

Now that we've established test results on data from the Goobits generator,
we'll run the same tests on the output of a CSPRNG that is known to be very strong. I
use the python `secrets` module to generate the output, which draws directly from the
OS's CSPRNG, which in my case is Linux's `/dev/random` which uses [ChaCha20](https://en.wikipedia.org/wiki/Salsa20#ChaCha_variant).
We'll use this as a baseline, and it will contextualize the Goobits results a bit more.

While generating random data from Goobits is slow (about 1kb/s), it is trivial
to generate GBs of random output from CSPRNGs as they are very fast. As such,
I am able to run tests on even more data than the 10,000 bitstreams that I did on Goobits.
So, I ran the test suite on five times the data as Goobits, in the form of four tests
on 10,000 bitstreams each. First, here are the "overall" results of each:

```
185/188 tests passed successfully both the analyses.
185/188 tests passed successfully both the analyses.
185/188 tests passed successfully both the analyses.
185/188 tests passed successfully both the analyses.
184/188 tests passed successfully both the analyses.

```

As you can see, 185/188 test passed is the norm, with one even
dipping below. So our slightly concerning result of 185/188 passed
on Goobits data is no longer conserning at all: we've confirmed
that a strong generator performs exactly the same. We can easily
conclude that this is a property of the test implementation and this
failure rate is to be expected even on random data.

Now for the more in depth results:

```
------------------------ RUN 0 -----------------------------------------------
Test                              Success   Fail  Total   Fail %  p-value Flag
------------------------------------------------------------------------------
ApproximateEntropy                   9886    114  10000    1.14% 0.089435 
BlockFrequency                       9896    104  10000    1.04% 0.357146 
CumulativeSums                      19817    183  20000    0.92% 0.894445 
DFT                                  9884    116  10000    1.16% 0.062223 
Frequency                            9909     91  10000    0.91% 0.829873 
LinearComplexity                     9906     94  10000    0.94% 0.740165 
LongestRun                           9895    105  10000    1.05% 0.320865 
NonOverlappingTemplate            1465099  14901 1480000    1.01% 0.203075 
OverlappingTemplate                  9909     91  10000    0.91% 0.829873 
RandomExcursions                    49995    549  50544    1.09% 0.028324 
RandomExcursionsVariant            112523   1201 113724    1.06% 0.030518 
Rank                                 9896    104  10000    1.04% 0.357146 
Runs                                 9897    103  10000    1.03% 0.394889 
Serial                              19790    210  20000    1.05% 0.247787 
Universal                            9876    124  10000    1.24% 0.010893 
```

```
------------------------ RUN 1 -----------------------------------------------
Test                              Success   Fail  Total   Fail %  p-value Flag
------------------------------------------------------------------------------
ApproximateEntropy                   9894    106  10000    1.06% 0.286326 
BlockFrequency                       9887    113  10000    1.13% 0.106060 
CumulativeSums                      19829    171  20000    0.85% 0.983782 
DFT                                  9880    120  10000    1.20% 0.027597 
Frequency                            9906     94  10000    0.94% 0.740165 
LinearComplexity                     9890    110  10000    1.10% 0.169394 
LongestRun                           9896    104  10000    1.04% 0.357146 
NonOverlappingTemplate            1465108  14892 1480000    1.01% 0.224677 
OverlappingTemplate                  9893    107  10000    1.07% 0.253758 
RandomExcursions                    49579    573  50152    1.14% 0.000897 <-- UNUSUAL
RandomExcursionsVariant            111836   1006 112842    0.89% 0.999909 
Rank                                 9878    122  10000    1.22% 0.017592 
Runs                                 9896    104  10000    1.04% 0.357146 
Serial                              19795    205  20000    1.03% 0.370626 
Universal                            9886    114  10000    1.14% 0.089435 
```

```
------------------------ RUN 2 -----------------------------------------------
Test                              Success   Fail  Total   Fail %  p-value Flag
------------------------------------------------------------------------------
ApproximateEntropy                   9910     90  10000    0.90% 0.854899 
BlockFrequency                       9897    103  10000    1.03% 0.394889 
CumulativeSums                      19780    220  20000    1.10% 0.084441 
DFT                                  9877    123  10000    1.23% 0.013894 
Frequency                            9886    114  10000    1.14% 0.089435 
LinearComplexity                     9883    117  10000    1.17% 0.051337 
LongestRun                           9890    110  10000    1.10% 0.169394 
NonOverlappingTemplate            1465082  14918 1480000    1.01% 0.165826 
OverlappingTemplate                  9913     87  10000    0.87% 0.914972 
RandomExcursions                    49224    544  49768    1.09% 0.020611 
RandomExcursionsVariant            110837   1141 111978    1.02% 0.265882 
Rank                                 9916     84  10000    0.84% 0.954481 
Runs                                 9913     87  10000    0.87% 0.914972 
Serial                              19806    194  20000    0.97% 0.674641 
Universal                            9886    114  10000    1.14% 0.089435 

```

```
------------------------ RUN 3 -----------------------------------------------
Test                              Success   Fail  Total   Fail %  p-value Flag
------------------------------------------------------------------------------
ApproximateEntropy                   9900    100  10000    1.00% 0.513499 
BlockFrequency                       9904     96  10000    0.96% 0.669714 
CumulativeSums                      19806    194  20000    0.97% 0.674641 
DFT                                  9892    108  10000    1.08% 0.223340 
Frequency                            9904     96  10000    0.96% 0.669714 
LinearComplexity                     9894    106  10000    1.06% 0.286326 
LongestRun                           9907     93  10000    0.93% 0.772395 
NonOverlappingTemplate            1465103  14897 1480000    1.01% 0.212518 
OverlappingTemplate                  9890    110  10000    1.10% 0.169394 
RandomExcursions                    49487    545  50032    1.09% 0.024740 
RandomExcursionsVariant            111511   1061 112572    0.94% 0.975458 
Rank                                 9891    109  10000    1.09% 0.195194 
Runs                                 9911     89  10000    0.89% 0.877397 
Serial                              19813    187  20000    0.94% 0.831132 
Universal                            9883    117  10000    1.17% 0.051337 

```

```
------------------------ RUN 4 -----------------------------------------------

Test                              Success   Fail  Total   Fail %  p-value Flag
------------------------------------------------------------------------------
ApproximateEntropy                   9891    109  10000    1.09% 0.195194 
BlockFrequency                       9893    107  10000    1.07% 0.253758 
CumulativeSums                      19817    183  20000    0.92% 0.894445 
DFT                                  9886    114  10000    1.14% 0.089435 
Frequency                            9914     86  10000    0.86% 0.930242 
LinearComplexity                     9902     98  10000    0.98% 0.593206 
LongestRun                           9910     90  10000    0.90% 0.854899 
NonOverlappingTemplate            1465071  14929 1480000    1.01% 0.144250 
OverlappingTemplate                  9884    116  10000    1.16% 0.062223 
RandomExcursions                    49342    594  49936    1.19% 0.000019 <-- UNUSUAL
RandomExcursionsVariant            111296   1060 112356    0.94% 0.973463 
Rank                                 9911     89  10000    0.89% 0.877397 
Runs                                 9907     93  10000    0.93% 0.772395 
Serial                              19793    207  20000    1.03% 0.318805 
Universal                            9878    122  10000    1.22% 0.017592 
```

And the overall failure rate across all of these five runs is 0.010095, with
a p-value of 0.002312.

### Contextualizing Goobits Results with the CSPRNG results

Looking at the CSPRNG results, essentially all of the concerning elements of the
Goobits results dissappear. First, the 185/188 overall tests was shown to be the norm
and not an outlier. Second, the low p-value for the DFT test looks not to be an anomaly,
as we saw two even lower p-values across the CSPRNG tests, with one being a whole order
of magnitude lower at 0.000019. And finally, the overall high failure rate and corresponding
low p-value for Goobits now looks more like a slight miscalibration of the test suite
than something caused by Goobits. Specifically, just as we saw a fail rate closer to
1.01% for Goobits, we see the same trend with the CSPRNG results at 1.0095%.
And more importantly, the p-value for the overall failure rate of the CSPRNG is
actually lower than that of Goobits: 0.002312 compared to .06 (the latter of which
is not even below any conventional 0.01 or even 0.05 threshold, while the former is).

All in all, there does not seem to be a statistically significant difference from the results
of the Goobits generator vs the CSPRNG ones; in fact, on the key metric of overall failed
tests Goobits performs slightly better (in terms of p-value, not raw fail-rate). While
I could go in circles testing more and more CSPRNG data with this test suite,
the already 50,000 bitstreams of one million bits are already quite strong evidence
of this trend towards a slightly higher than expected fail-rate and lower p-values,
and it seems it is likely due to a small miscalibration of the test since we see
these results with a state-of-the-art CSPRNG.

## Conclusion

I ran the improved STS randomness test on 10,000 bitstreams of about one million bits each
of Goobits-generated data. Taken at face value the results are not particularly indicative of
a generator defect, as all p-values but one are not below any statistically significant threshold.
But the one failed p-value and the overall trend towards lower (< 0.1) p-values do raise some concern.
However, after running the test suite on a state-of-the-art CSPRNG that is known to be a strong
generator (and whose output is not known to be distinguishable from random), these concerns essentially vanish.
The low p-value for the DFT test sits alongside two equally or more extreme p-values on the CSPRNG data, and the
overall trend of low p-values / high test failure-rate is replicated in the CSPRNG results as well.
In fact, the overall failure-rate p-value for the CSPRNG data (albeit with 5x as much data, which will
drive any test miscalibration to more severe p-values) is actually an order of magnitude lower
than that of the Goobits results. Overall, the Goobits results are not statistically distinguishable
from the CSPRNG results, and hence this test suite did not provide any evidence of non-randomness
or a defect in the Goobits generator.
