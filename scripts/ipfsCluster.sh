#!/bin/bash

# Colors
RED='\e[31m'
YELLOW='\e[33m'
GREEN='\e[32m'
NC='\e[0m'




function CheckArgument {
    if [[ -z "$1" ]]; then
        echo -e "${RED}Error: First Argument is mandatory ${NC}"
        echo -e "--------------------------------\n"
        Helper
        exit 1
    fi
}

# Helper function
function Helper {
    echo -e "${YELLOW}Usage: $0 [start]${NC}"
    echo -e "start - Starts the ipfs cluster"
}

CheckArgument "$1"


if [[ "$1" == "start" ]]; then
    echo -e "${GREEN}Starting ipfs cluster...${NC}"
    docker compose -f /home/drnull/Whisper/ipfs/docker-compose.yml up 



else
    echo -e "${RED}Error: Invalid argument '$1'${NC}"
    Helper
    exit 1
fi







