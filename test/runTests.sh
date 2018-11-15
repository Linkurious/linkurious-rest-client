#!/bin/bash

rm -rf tempTests
rm ../linkurious-server/data/server/dbTest.sqlite
rm ../linkurious-server/data/server/dbTest.sqlite-shm
rm ../linkurious-server/data/server/dbTest.sqlite-wal
rm ../linkurious-server/data/config/test.json
node ../linkurious-server/dist/test/runMocha.js -sm &
SERVER_PID=`echo $!`

npm run compileTests
npm run lint
istanbul cover --root ../linkurious-server/server/services/webServer/routes --report html --dir cover_API node_modules/.bin/karma start karma.conf.js

kill -9 "$SERVER_PID"
