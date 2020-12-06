#!/bin/bash

mkdir -p "./files/${1}"
mkdir -p "./files2/${1}"

for ch in "bin" "lib" "lib64" "usr"
do 
    mkdir -p "./files2/${1}/${ch}"
    mkdir -p "./files2/projects"
    mount --bind -o ro "/${ch}" "./files2/${1}/${ch}"
    mount --bind -o ro "./files/${1}" "./files2/projects"
done