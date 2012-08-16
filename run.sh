#!/bin/bash
./server.py &
guard &
sass --watch static/sass/:static/css -C &
