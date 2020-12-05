#!bin/bash

cd "files2/${2}/"
chroot . ./bin/bash
${1}