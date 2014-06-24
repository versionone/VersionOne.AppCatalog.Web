export PATH=$(pwd)/../../node_modules/.bin:$PATH
rm -rf app_cov
cd app 
./build.sh
cd ..
cd test
./build.sh
cd ..