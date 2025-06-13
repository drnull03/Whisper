// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.8.2 <0.9.0;


contract Calculator {

    uint256 result;

    constructor(){
        result=0;
    }

    function add(uint256 x,uint256 y) public {
        result=x+y;
    }

    function sub(uint256 x,uint256 y) public {
        result=x-y;
    }

    function multi(uint256 x, uint256 y)public{
        result=x*y;
    }

    function div(uint256 x,uint256 y) public {
        if(y == 0){
            result=0;
        }else{
            result=x/y;
        }

    }


    function retrieve() public view returns (uint256){
        return result;
    }


}
