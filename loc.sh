#!/bin/bash

for i in html css js
do
    echo "$i:" $(find . -name "*.$i" | xargs wc -l | grep total | grep -o [0-9]*)
done
echo total
