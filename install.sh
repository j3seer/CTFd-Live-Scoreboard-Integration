
usage='Usage: ./install.sh "~/CTFd"'

if [ -z "$1" ]
  then
    tput setaf 1;echo "No CTFd path supplied!";tput sgr0;
    printf "\n$usage"
    exit 1
fi

ctfd_path = $1
plugins_path = "$ctfd_path/CTFd/plugins/"
try
	echo "Installing plugin...."
	mv livescoreboard_plugin $plugins_path
catch
	echo "Something went wrong..$__EXCEPTION_SOURCE__ at line: $__EXCEPTION_LINE__!"


echo -e "Before running the app, make sure that you modified the docker-compose.yml file as you wish.."

echo -e "Sleeping for 5 seconds before running\n"

sleep 5

echo "Attempting to run the livescoreboard app.."

cd livescoreboard_app && sudo docker-compose up --build -d

