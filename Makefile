PATH := node_modules/.bin:$(PATH)
SHELL := /bin/bash

UNAME_S := $(shell uname -s)

ifeq ($(UNAME_S),Linux)
    OS_TYPE := linux
endif
ifeq ($(UNAME_S),Darwin)
    OS_TYPE := osx
endif

.FORCE:

all: clean
	babel src -d dist --source-maps

clean: .FORCE
	rimraf npm-debug.log dist

osx-syspackages: .FORCE
	brew update
	brew install yarn

linux-syspackages: .FORCE
	sudo apt-key adv --keyserver pgp.mit.edu --recv D101F7899D41F3C3
	echo "deb http://dl.yarnpkg.com/debian/ stable main" | sudo tee /etc/apt/sources.list.d/yarn.list
	sudo apt-get -y update
	sudo apt-get install yarn

environment: .FORCE
	@if [ "${OS_TYPE}" = "osx" ]; then \
		make osx-syspackages; \
	else \
		make linux-syspackages; \
	fi

dependencies: .FORCE
	yarn

test: all
	mocha

lint: .FORCE
	eslint src
