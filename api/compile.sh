#!bin/bash

cd "./files2/${2}/"
chroot "." "./bin/bash" "./run.sh" "${1}" "${2}"
