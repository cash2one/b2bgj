#!/bin/bash
module='finance'
dst=~/www/proto-b2b/运营商/财务2

mkdir $dst
cd templates/$module/
for x in `find -name "*.html"`
do
     wget http://0.0.0.0:8888/$module/$x -nH --cut-dirs=1 -P $dst -x --restrict-file-names=nocontrol 
done
