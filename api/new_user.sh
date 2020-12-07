#!/bin/bash

mkdir -p "./files/${1}"
mkdir -p "./files2/${1}"
mkdir -p "./files2/${1}/${1}"
cp "./run.sh" "./files2/${1}/run.sh"
mount --bind -o ro "./files/${1}" "./files2/${1}/${1}"

for ch in "bin" "lib" "lib64" "usr"
do 
    mkdir -p "./files2/${1}/${ch}"
    mount --bind -o ro "/${ch}" "./files2/${1}/${ch}"
done
