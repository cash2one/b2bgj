#!/bin/bash

module='gnjp'
# usergroup=$1

dst=~/www/proto-b2b/运营商/国内机票白屏

echo "save to ${dst}"

mkdir $dst
# mkdir $dst/static

# cp -rv static/css/ $dst/static
# cp -rv static/js/*.js $dst/static/js/
# cp -rv static/img/ $dst/static
# # cp -p -r static/kendoUI/ $dst/static
# cp -rv templates/$module/ajax $dst/
# 
# cp -rv static/css/* $projdst/static/css
# cp -rv static/js/*.js $projdst/static/js/
# cp -rv static/img/* $projdst/static/img

cd templates/$module/

for x in *.html
do
    wget --restrict-file-names=unix http://0.0.0.0:8888/$module/$x -O $dst/$x
    # wget --restrict-file-names=unix http://0.0.0.0:8888/$module/$x -O $dst/$x
    # echo $x
done

# cd $dst
# cd ..
# tar -zcvf $module$(date +%Y%m%d_%H%M%S).tar.gz $module

