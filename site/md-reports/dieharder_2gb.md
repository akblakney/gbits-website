# Testing with `dieharder` on ~2GB of data

## Approach and consdierations

[Dieharder](https://linux.die.net/man/1/dieharder) is a well-known statistical test suite for RNGs. It
works by running a series of statistical tests and giving a p-value for each. It then classifies
each test as either PASSED, WEAK, or FAILURE depending on the p-value. While dieharder is intended
to run on extremely large streams of data produced by PRNGs, it can run on a fixed amount of data
in a file as well. However, dieharder is very data-hungry and so it will re-wind the file several times
throughout statistical testing. If the file is large enough this is not such a big problem, but when
the file is re-wound within a single statistical test it can certainly distort test results.
For example, running dieharder on files less than 1GB in size--even when those files are the output
of state-of-the-art CSPRNGs--can produce a disproportionate amount of WEAK test results, and even some
FAILUREs. Therefore, we should take these results with a grain of salt, and more importantly, I've
followed my approach for the STS test and ran dieharder against files of random data produced by a
state-of-the-art CSPRNG so we can have a baseline.

## Results

Here are the dieharder results when run on the output of the Goobits generator, with
about 2GB of data:

```
#=============================================================================#
#            dieharder version 3.31.1 Copyright 2003 Robert G. Brown          #
#=============================================================================#
   rng_name    |           filename             |rands/second|
 file_input_raw|                         all.bin|  8.82e+07  |
#=============================================================================#
        test_name   |ntup| tsamples |psamples|  p-value |Assessment
#=============================================================================#
   diehard_birthdays|   0|       100|     100|0.13168982|  PASSED  
      diehard_operm5|   0|   1000000|     100|0.19884125|  PASSED  
  diehard_rank_32x32|   0|     40000|     100|0.80689912|  PASSED  
    diehard_rank_6x8|   0|    100000|     100|0.83771206|  PASSED  
   diehard_bitstream|   0|   2097152|     100|0.43686506|  PASSED  
        diehard_opso|   0|   2097152|     100|0.52255037|  PASSED  
        diehard_oqso|   0|   2097152|     100|0.66055620|  PASSED  
         diehard_dna|   0|   2097152|     100|0.62477855|  PASSED  
diehard_count_1s_str|   0|    256000|     100|0.08723190|  PASSED  
diehard_count_1s_byt|   0|    256000|     100|0.26329782|  PASSED  
 diehard_parking_lot|   0|     12000|     100|0.95056725|  PASSED  
    diehard_2dsphere|   2|      8000|     100|0.10972043|  PASSED  
    diehard_3dsphere|   3|      4000|     100|0.79945503|  PASSED  
     diehard_squeeze|   0|    100000|     100|0.06602730|  PASSED  
        diehard_sums|   0|       100|     100|0.90457772|  PASSED  
        diehard_runs|   0|    100000|     100|0.44110357|  PASSED  
        diehard_runs|   0|    100000|     100|0.94748834|  PASSED  
       diehard_craps|   0|    200000|     100|0.91749417|  PASSED  
       diehard_craps|   0|    200000|     100|0.59010613|  PASSED  
 marsaglia_tsang_gcd|   0|  10000000|     100|0.75191198|  PASSED  
 marsaglia_tsang_gcd|   0|  10000000|     100|0.33401228|  PASSED  
         sts_monobit|   1|    100000|     100|0.82124995|  PASSED  
            sts_runs|   2|    100000|     100|0.44879754|  PASSED  
          sts_serial|   1|    100000|     100|0.99443515|  PASSED  
          sts_serial|   2|    100000|     100|0.16915526|  PASSED  
          sts_serial|   3|    100000|     100|0.84941549|  PASSED  
          sts_serial|   3|    100000|     100|0.84557303|  PASSED  
          sts_serial|   4|    100000|     100|0.97052925|  PASSED  
          sts_serial|   4|    100000|     100|0.99675460|   WEAK   
          sts_serial|   5|    100000|     100|0.87548777|  PASSED  
          sts_serial|   5|    100000|     100|0.66233209|  PASSED  
          sts_serial|   6|    100000|     100|0.93580392|  PASSED  
          sts_serial|   6|    100000|     100|0.78737818|  PASSED  
          sts_serial|   7|    100000|     100|0.92041933|  PASSED  
          sts_serial|   7|    100000|     100|0.61506845|  PASSED  
          sts_serial|   8|    100000|     100|0.38581141|  PASSED  
          sts_serial|   8|    100000|     100|0.72589734|  PASSED  
          sts_serial|   9|    100000|     100|0.92013692|  PASSED  
          sts_serial|   9|    100000|     100|0.22289677|  PASSED  
          sts_serial|  10|    100000|     100|0.97324403|  PASSED  
          sts_serial|  10|    100000|     100|0.60648348|  PASSED  
          sts_serial|  11|    100000|     100|0.77280701|  PASSED  
          sts_serial|  11|    100000|     100|0.78464670|  PASSED  
          sts_serial|  12|    100000|     100|0.69299117|  PASSED  
          sts_serial|  12|    100000|     100|0.86271245|  PASSED  
          sts_serial|  13|    100000|     100|0.61516836|  PASSED  
          sts_serial|  13|    100000|     100|0.48122997|  PASSED  
          sts_serial|  14|    100000|     100|0.73432315|  PASSED  
          sts_serial|  14|    100000|     100|0.87592812|  PASSED  
          sts_serial|  15|    100000|     100|0.34486408|  PASSED  
          sts_serial|  15|    100000|     100|0.99888717|   WEAK   
          sts_serial|  16|    100000|     100|0.10744965|  PASSED  
          sts_serial|  16|    100000|     100|0.70781459|  PASSED  
         rgb_bitdist|   1|    100000|     100|0.80253911|  PASSED  
         rgb_bitdist|   2|    100000|     100|0.91425621|  PASSED  
         rgb_bitdist|   3|    100000|     100|0.65901520|  PASSED  
         rgb_bitdist|   4|    100000|     100|0.81129184|  PASSED  
         rgb_bitdist|   5|    100000|     100|0.98123041|  PASSED  
         rgb_bitdist|   6|    100000|     100|0.77838841|  PASSED  
         rgb_bitdist|   7|    100000|     100|0.26900605|  PASSED  
         rgb_bitdist|   8|    100000|     100|0.57105864|  PASSED  
         rgb_bitdist|   9|    100000|     100|0.99837522|   WEAK   
         rgb_bitdist|  10|    100000|     100|0.88353296|  PASSED  
         rgb_bitdist|  11|    100000|     100|0.66028528|  PASSED  
         rgb_bitdist|  12|    100000|     100|0.47451384|  PASSED  
rgb_minimum_distance|   2|     10000|    1000|0.64995131|  PASSED  
rgb_minimum_distance|   3|     10000|    1000|0.99178573|  PASSED  
rgb_minimum_distance|   4|     10000|    1000|0.31619115|  PASSED  
rgb_minimum_distance|   5|     10000|    1000|0.00827875|  PASSED  
    rgb_permutations|   2|    100000|     100|0.97561892|  PASSED  
    rgb_permutations|   3|    100000|     100|0.45096083|  PASSED  
    rgb_permutations|   4|    100000|     100|0.44824594|  PASSED  
    rgb_permutations|   5|    100000|     100|0.02080624|  PASSED  
      rgb_lagged_sum|   0|   1000000|     100|0.16140103|  PASSED  
      rgb_lagged_sum|   1|   1000000|     100|0.79036987|  PASSED  
      rgb_lagged_sum|   2|   1000000|     100|0.05606520|  PASSED  
      rgb_lagged_sum|   3|   1000000|     100|0.43736173|  PASSED  
      rgb_lagged_sum|   4|   1000000|     100|0.27185471|  PASSED  
      rgb_lagged_sum|   5|   1000000|     100|0.56784819|  PASSED  
      rgb_lagged_sum|   6|   1000000|     100|0.03913477|  PASSED  
      rgb_lagged_sum|   7|   1000000|     100|0.56500155|  PASSED  
      rgb_lagged_sum|   8|   1000000|     100|0.17191308|  PASSED  
      rgb_lagged_sum|   9|   1000000|     100|0.04436640|  PASSED  
      rgb_lagged_sum|  10|   1000000|     100|0.54350159|  PASSED  
      rgb_lagged_sum|  11|   1000000|     100|0.14158815|  PASSED  
      rgb_lagged_sum|  12|   1000000|     100|0.46932780|  PASSED  
      rgb_lagged_sum|  13|   1000000|     100|0.97840037|  PASSED  
      rgb_lagged_sum|  14|   1000000|     100|0.61414039|  PASSED  
      rgb_lagged_sum|  15|   1000000|     100|0.07570622|  PASSED  
      rgb_lagged_sum|  16|   1000000|     100|0.92315413|  PASSED  
      rgb_lagged_sum|  17|   1000000|     100|0.32767144|  PASSED  
      rgb_lagged_sum|  18|   1000000|     100|0.60628784|  PASSED  
      rgb_lagged_sum|  19|   1000000|     100|0.87422273|  PASSED  
      rgb_lagged_sum|  20|   1000000|     100|0.47294245|  PASSED  
      rgb_lagged_sum|  21|   1000000|     100|0.69531229|  PASSED  
      rgb_lagged_sum|  22|   1000000|     100|0.35038332|  PASSED  
      rgb_lagged_sum|  23|   1000000|     100|0.26046295|  PASSED  
      rgb_lagged_sum|  24|   1000000|     100|0.80569410|  PASSED  
      rgb_lagged_sum|  25|   1000000|     100|0.02815917|  PASSED  
      rgb_lagged_sum|  26|   1000000|     100|0.26597960|  PASSED  
      rgb_lagged_sum|  27|   1000000|     100|0.90050247|  PASSED  
      rgb_lagged_sum|  28|   1000000|     100|0.03208271|  PASSED  
      rgb_lagged_sum|  29|   1000000|     100|0.17197959|  PASSED  
      rgb_lagged_sum|  30|   1000000|     100|0.61534787|  PASSED  
      rgb_lagged_sum|  31|   1000000|     100|0.77078973|  PASSED  
      rgb_lagged_sum|  32|   1000000|     100|0.04443941|  PASSED  
     rgb_kstest_test|   0|     10000|    1000|0.43727870|  PASSED  
     dab_bytedistrib|   0|  51200000|       1|0.23362492|  PASSED  
             dab_dct| 256|     50000|       1|0.25149694|  PASSED  
Preparing to run test 207.  ntuple = 0
        dab_filltree|  32|  15000000|       1|0.00299947|   WEAK   
        dab_filltree|  32|  15000000|       1|0.76036354|  PASSED  
Preparing to run test 208.  ntuple = 0
       dab_filltree2|   0|   5000000|       1|0.16170225|  PASSED  
       dab_filltree2|   1|   5000000|       1|0.75474916|  PASSED  
Preparing to run test 209.  ntuple = 0
        dab_monobit2|  12|  65000000|       1|0.04687489|  PASSED  

```

And as a baseline, here are the results of dieharder run on the same
size file generated by a state-of-the-art CSPRNG (in this case,
ChaCha20 via `/dev/urandom`):

```
#=============================================================================#
#            dieharder version 3.31.1 Copyright 2003 Robert G. Brown          #
#=============================================================================#
   rng_name    |           filename             |rands/second|
 file_input_raw|                    csprng01.bin|  5.33e+07  |
#=============================================================================#
        test_name   |ntup| tsamples |psamples|  p-value |Assessment
#=============================================================================#
   diehard_birthdays|   0|       100|     100|0.11714970|  PASSED  
      diehard_operm5|   0|   1000000|     100|0.42551987|  PASSED  
  diehard_rank_32x32|   0|     40000|     100|0.59259171|  PASSED  
    diehard_rank_6x8|   0|    100000|     100|0.63634467|  PASSED  
   diehard_bitstream|   0|   2097152|     100|0.88763343|  PASSED  
        diehard_opso|   0|   2097152|     100|0.90730951|  PASSED  
        diehard_oqso|   0|   2097152|     100|0.37117112|  PASSED  
         diehard_dna|   0|   2097152|     100|0.79414442|  PASSED  
diehard_count_1s_str|   0|    256000|     100|0.93120869|  PASSED  
diehard_count_1s_byt|   0|    256000|     100|0.38485087|  PASSED  
 diehard_parking_lot|   0|     12000|     100|0.47786440|  PASSED  
    diehard_2dsphere|   2|      8000|     100|0.28173501|  PASSED  
    diehard_3dsphere|   3|      4000|     100|0.72797811|  PASSED  
     diehard_squeeze|   0|    100000|     100|0.95767395|  PASSED  
        diehard_sums|   0|       100|     100|0.00442017|   WEAK   
        diehard_runs|   0|    100000|     100|0.35165462|  PASSED  
        diehard_runs|   0|    100000|     100|0.51517323|  PASSED  
       diehard_craps|   0|    200000|     100|0.99399545|  PASSED  
       diehard_craps|   0|    200000|     100|0.39478565|  PASSED  
 marsaglia_tsang_gcd|   0|  10000000|     100|0.00318417|   WEAK   
 marsaglia_tsang_gcd|   0|  10000000|     100|0.64358526|  PASSED  
         sts_monobit|   1|    100000|     100|0.66794568|  PASSED  
            sts_runs|   2|    100000|     100|0.49456762|  PASSED  
          sts_serial|   1|    100000|     100|0.99333636|  PASSED  
          sts_serial|   2|    100000|     100|0.47911232|  PASSED  
          sts_serial|   3|    100000|     100|0.00714146|  PASSED  
          sts_serial|   3|    100000|     100|0.00057137|   WEAK   
          sts_serial|   4|    100000|     100|0.16417817|  PASSED  
          sts_serial|   4|    100000|     100|0.70383498|  PASSED  
          sts_serial|   5|    100000|     100|0.67533744|  PASSED  
          sts_serial|   5|    100000|     100|0.22157423|  PASSED  
          sts_serial|   6|    100000|     100|0.60461187|  PASSED  
          sts_serial|   6|    100000|     100|0.81294088|  PASSED  
          sts_serial|   7|    100000|     100|0.60968257|  PASSED  
          sts_serial|   7|    100000|     100|0.49489779|  PASSED  
          sts_serial|   8|    100000|     100|0.87263208|  PASSED  
          sts_serial|   8|    100000|     100|0.88458429|  PASSED  
          sts_serial|   9|    100000|     100|0.48164156|  PASSED  
          sts_serial|   9|    100000|     100|0.29174685|  PASSED  
          sts_serial|  10|    100000|     100|0.28519079|  PASSED  
          sts_serial|  10|    100000|     100|0.99635389|   WEAK   
          sts_serial|  11|    100000|     100|0.36622212|  PASSED  
          sts_serial|  11|    100000|     100|0.64793363|  PASSED  
          sts_serial|  12|    100000|     100|0.96204092|  PASSED  
          sts_serial|  12|    100000|     100|0.90727717|  PASSED  
          sts_serial|  13|    100000|     100|0.17352069|  PASSED  
          sts_serial|  13|    100000|     100|0.01261554|  PASSED  
          sts_serial|  14|    100000|     100|0.33864032|  PASSED  
          sts_serial|  14|    100000|     100|0.18222771|  PASSED  
          sts_serial|  15|    100000|     100|0.78763467|  PASSED  
          sts_serial|  15|    100000|     100|0.99161287|  PASSED  
          sts_serial|  16|    100000|     100|0.06233809|  PASSED  
          sts_serial|  16|    100000|     100|0.06274766|  PASSED  
         rgb_bitdist|   1|    100000|     100|0.97448168|  PASSED  
         rgb_bitdist|   2|    100000|     100|0.09765141|  PASSED  
         rgb_bitdist|   3|    100000|     100|0.74850205|  PASSED  
         rgb_bitdist|   4|    100000|     100|0.74675679|  PASSED  
         rgb_bitdist|   5|    100000|     100|0.96134338|  PASSED  
         rgb_bitdist|   6|    100000|     100|0.70500187|  PASSED  
         rgb_bitdist|   7|    100000|     100|0.33898429|  PASSED  
         rgb_bitdist|   8|    100000|     100|0.50259818|  PASSED  
         rgb_bitdist|   9|    100000|     100|0.96735983|  PASSED  
         rgb_bitdist|  10|    100000|     100|0.82645054|  PASSED  
         rgb_bitdist|  11|    100000|     100|0.41943718|  PASSED  
         rgb_bitdist|  12|    100000|     100|0.97188132|  PASSED  
rgb_minimum_distance|   2|     10000|    1000|0.50525758|  PASSED  
rgb_minimum_distance|   3|     10000|    1000|0.48119377|  PASSED  
rgb_minimum_distance|   4|     10000|    1000|0.97850391|  PASSED  
rgb_minimum_distance|   5|     10000|    1000|0.78286798|  PASSED  
    rgb_permutations|   2|    100000|     100|0.33710155|  PASSED  
    rgb_permutations|   3|    100000|     100|0.09689789|  PASSED  
    rgb_permutations|   4|    100000|     100|0.99876533|   WEAK   
    rgb_permutations|   5|    100000|     100|0.33812184|  PASSED  
      rgb_lagged_sum|   0|   1000000|     100|0.62450869|  PASSED  
      rgb_lagged_sum|   1|   1000000|     100|0.91922922|  PASSED  
      rgb_lagged_sum|   2|   1000000|     100|0.87108011|  PASSED  
      rgb_lagged_sum|   3|   1000000|     100|0.18012842|  PASSED  
      rgb_lagged_sum|   4|   1000000|     100|0.61513579|  PASSED  
      rgb_lagged_sum|   5|   1000000|     100|0.97407833|  PASSED  
      rgb_lagged_sum|   6|   1000000|     100|0.51844048|  PASSED  
      rgb_lagged_sum|   7|   1000000|     100|0.32118249|  PASSED  
      rgb_lagged_sum|   8|   1000000|     100|0.95331507|  PASSED  
      rgb_lagged_sum|   9|   1000000|     100|0.64082492|  PASSED  
      rgb_lagged_sum|  10|   1000000|     100|0.55067673|  PASSED  
      rgb_lagged_sum|  11|   1000000|     100|0.01331968|  PASSED  
      rgb_lagged_sum|  12|   1000000|     100|0.91123826|  PASSED  
      rgb_lagged_sum|  13|   1000000|     100|0.84530421|  PASSED  
      rgb_lagged_sum|  14|   1000000|     100|0.03908828|  PASSED  
      rgb_lagged_sum|  15|   1000000|     100|0.75128884|  PASSED  
      rgb_lagged_sum|  16|   1000000|     100|0.88364215|  PASSED  
      rgb_lagged_sum|  17|   1000000|     100|0.50632852|  PASSED  
      rgb_lagged_sum|  18|   1000000|     100|0.08609252|  PASSED  
      rgb_lagged_sum|  19|   1000000|     100|0.91182781|  PASSED  
      rgb_lagged_sum|  20|   1000000|     100|0.16214568|  PASSED  
      rgb_lagged_sum|  21|   1000000|     100|0.22036413|  PASSED  
      rgb_lagged_sum|  22|   1000000|     100|0.36405040|  PASSED  
      rgb_lagged_sum|  23|   1000000|     100|0.21231668|  PASSED  
      rgb_lagged_sum|  24|   1000000|     100|0.90939009|  PASSED  
      rgb_lagged_sum|  25|   1000000|     100|0.78076298|  PASSED  
      rgb_lagged_sum|  26|   1000000|     100|0.96801479|  PASSED  
      rgb_lagged_sum|  27|   1000000|     100|0.31762550|  PASSED  
      rgb_lagged_sum|  28|   1000000|     100|0.36283316|  PASSED  
      rgb_lagged_sum|  29|   1000000|     100|0.32545847|  PASSED  
      rgb_lagged_sum|  30|   1000000|     100|0.68750100|  PASSED  
      rgb_lagged_sum|  31|   1000000|     100|0.34973081|  PASSED  
      rgb_lagged_sum|  32|   1000000|     100|0.46123974|  PASSED  
     rgb_kstest_test|   0|     10000|    1000|0.24165393|  PASSED  
     dab_bytedistrib|   0|  51200000|       1|0.87786195|  PASSED  
             dab_dct| 256|     50000|       1|0.12488848|  PASSED  
Preparing to run test 207.  ntuple = 0
        dab_filltree|  32|  15000000|       1|0.68054663|  PASSED  
        dab_filltree|  32|  15000000|       1|0.14908396|  PASSED  
Preparing to run test 208.  ntuple = 0
       dab_filltree2|   0|   5000000|       1|0.65357011|  PASSED  
       dab_filltree2|   1|   5000000|       1|0.34424362|  PASSED  
Preparing to run test 209.  ntuple = 0
        dab_monobit2|  12|  65000000|       1|0.88768342|  PASSED  

```

### Results summary

Overall the results are very promising, and they fail to provide any evidence that the Goobits generator
is not random. As you can see above, neither generator had any FAILURE results, and both had a few
WEAK results. Goobits had four WEAK results while the CSPRNG had five. While four to five WEAK results
is more than we'd expect for random data, it is clear that since the CSPRNG test results show this pattern,
it is due to the file rewinding than due to any actual positive detection of non-randomness. Indeed,
throughout each of the tests, the files were each rewound 109 times. 

## Summary

The dieharder test suite failed to provide any evidence of non-randomness from the generator,
and the test results of the Goobits data are practically indistinguishable from the results of
a state-of-the-art CSPRNG. Therefore this dieahrder test run fails to show any defects in the generator,
and gives confidence that Goobits passes this rigorous statistical test suite.