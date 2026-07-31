#!/bin/bash

# convert stats reports to md


rsync -av --delete \
    ~/gbits-website/site/ \
    /srv/www/gbits/
