// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.8.2 <0.9.0;




contract StructTest {
    
    struct Point{
        uint256 x;
        uint256 y;
    }
    

    Point p1;
    constructor(uint256 a,uint256 b){
        p1.x=a;
        p1.y=b;
    }
    function getPoint() public view returns (Point memory){
        return p1;
    }


}
