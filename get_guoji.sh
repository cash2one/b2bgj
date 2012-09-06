#!/bin/bash

module=guoji
usergroup=$1

dst=~/www/bycwork/$module-$usergroup
projdst=~/www/bycwork/byc_supper/InternationalFlights/InternationalFlights.WebUI

echo "save to ${dst}"

mkdir $dst
mkdir $dst/static

cp -rv static/css/ $dst/static
cp -rv static/js/ $dst/static
cp -rv static/img/ $dst/static
# cp -p -r static/kendoUI/ $dst/static
cp -rv templates/$module/ajax $dst/

cp -rv static/css/* $projdst/CSS
cp -rv static/js/* $projdst/JS
cp -rv static/img/* $projdst/IMG

cd templates/$module/

for x in *.html
do
    wget --restrict-file-names=unix http://0.0.0.0:8888/$module/$x?usergroup=$usergroup -O $dst/$x
    # echo $x
done

# cd $dst
# cd ..
# tar -zcvf $module$(date +%Y%m%d_%H%M%S).tar.gz $module

