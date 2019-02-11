#!/bin/bash

rm -rf tempTests
rm ../linkurious-server/data/server/dbTest.sqlite
rm ../linkurious-server/data/server/dbTest.sqlite-shm
rm ../linkurious-server/data/server/dbTest.sqlite-wal
rm ../linkurious-server/data/config/test.json
node ../linkurious-server/dist/test/runMocha.js -sm &
SERVER_PID=`echo $!`

./node_modules/.bin/karma start

kill -9 "$SERVER_PID"
