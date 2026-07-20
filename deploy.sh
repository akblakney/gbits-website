#!/bin/bash
rsync -av --delete \
    ~/gbits-website/site/ \
    /srv/www/gbits/
