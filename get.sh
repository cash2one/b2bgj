#!/bin/bash

module=$1

dst=~/www/BYCWORK/$module

echo 'save to ${dst}\n'

mkdir $dst
mkdir $dst/static

cp -r static/css/ $dst/static
cp -r static/js/ $dst/static
cp -r static/img/ $dst/static

cd templates/$module/

for x in *.html
do
    wget --restrict-file-names=unix http://0.0.0.0:8888/$module/$x?usergroup=$2 -O $dst/$x
    # echo $x
done

# cd $dst
# cd ..
# tar -zcvf $module$(date +%Y%m%d_%H%M%S).tar.gz $module

