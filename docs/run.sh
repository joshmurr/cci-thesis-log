#!/bin/bash

CMD=$1

JEKYLL_ENV=${CMD} bundle exec jekyll serve
