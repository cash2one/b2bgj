#!/bin/bash

module=guonei
usergroup=$1

dst=~/www/bycwork/$module-$usergroup
projdst=~/www/bycwork/byc_supper/YeeSohoWeb4.0

echo "save to ${dst}"

mkdir $dst
mkdir $dst/static

cp -rv static/css/ $dst/static
cp -rv static/js/ $dst/static
cp -rv static/img/ $dst/static
# cp -p -r static/kendoUI/ $dst/static
cp -rv templates/$module/ajax $dst/

cp -rv static/css/* $projdst/static/css
cp -rv static/js/* $projdst/static/js
cp -rv static/img/* $projdst/static/img

cd templates/$module/

for x in *.html
do
    wget --restrict-file-names=unix http://0.0.0.0:8888/$module/$x?usergroup=$usergroup -O $dst/$x
    # echo $x
done

# cd $dst
# cd ..
# tar -zcvf $module$(date +%Y%m%d_%H%M%S).tar.gz $module

