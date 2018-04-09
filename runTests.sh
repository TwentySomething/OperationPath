#!/usr/bin/env bash

declare -a files=(
    "Number"
    "Core"
);

for file in "${files[@]}"
do
    echo "
--------- $file ---------
";

    ./node_modules/.bin/babel-node tests/$file.js

done

echo "done"