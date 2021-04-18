#!/bin/sh

while :
do
	node .

	if  [ $? -eq 0 ]
	then
		break
	fi

	echo "Exited unexpectedly, restarting..."
done

echo "Exited with code Zero."