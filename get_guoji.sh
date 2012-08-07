#!/bin/bash

module=guoji
usergroup=$1

dst=~/www/BYCWORK/$module-$usergroup

echo "save to ${dst}\n"

mkdir $dst
mkdir $dst/static

cp -r static/css/ $dst/static
cp -r static/js/ $dst/static
cp -r static/img/ $dst/static
# cp -r static/kendoUI/ $dst/static
cp -r templates/$module/ajax $dst/ajax

cd templates/$module/

for x in *.html
do
    wget --restrict-file-names=unix http://0.0.0.0:8888/$module/$x?usergroup=$usergroup -O $dst/$x
    # echo $x
done

# cd $dst
# cd ..
# tar -zcvf $module$(date +%Y%m%d_%H%M%S).tar.gz $module

