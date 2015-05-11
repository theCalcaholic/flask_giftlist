#!/bin/bash

if [ -n "$1" ]
then
    sudo su www-data -c "git $1"
fi
