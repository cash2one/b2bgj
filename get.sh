#!/bin/bash

module=$1

dst=~/Desktop/$module

echo 'save to ${dst}\n'

mkdir $dst

cp -r static/css/ $dst
cp -r static/js/ $dst
cp -r static/img/ $dst

cd templates/$module/

for x in *.html
do
    wget --restrict-file-names=unix http://0.0.0.0:8888/$module/$x -O $dst/$x
    # echo $x
done

cd $dst
cd ..
tar -zcvf $module$(date +%Y%m%d_%H%M%S).tar.gz $module

