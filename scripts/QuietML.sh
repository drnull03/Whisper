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
    echo -e "${YELLOW}Usage: $0 [start|stop|test]${NC}"
    echo -e "start - Starts the docker container"
    echo -e "stop  - Stops the docker container"
    echo -e "test  - Tests the API endpoint"
}

CheckArgument "$1"

if [[ "$1" == "start" ]]; then
    echo -e "${GREEN}Starting container...${NC}"
    docker start quiet-mlC >/dev/null 2>&1
    if [[ $? -ne 0 ]]; then
        echo -e "${RED}Error: Failed to start container${NC}"
        exit 1
    else
        echo -e "${GREEN}Started successfully${NC}"
    fi

elif [[ "$1" == "stop" ]]; then
    echo -e "${YELLOW}Stopping container...${NC}"
    docker stop quiet-mlC >/dev/null 2>&1
    if [[ $? -ne 0 ]]; then
        echo -e "${RED}Error: Failed to stop container${NC}"
        exit 1
    else
        echo -e "${GREEN}Stopped successfully${NC}"
    fi

elif [[ "$1" == "test" ]]; then
    echo -e "${YELLOW}Testing API endpoint...${NC}"
    response=$(curl -s -X POST http://localhost:5000/predict \
        -H "Content-Type: application/json" \
        -d '{"email_text": "Congratulations! You have won a free lottery ticket!"}')
    
    if [[ $? -ne 0 ]]; then
        echo -e "${RED}Error: API request failed${NC}"
        exit 1
    else
        echo -e "${GREEN}API Response:${NC}"
        echo "$response" | jq . 2>/dev/null || echo "$response"
    fi

else
    echo -e "${RED}Error: Invalid argument '$1'${NC}"
    Helper
    exit 1
fi
